import { subHours } from "date-fns";
import { injectable } from "inversify";
import { ObjectId } from "mongodb";
import { isAlpha, isEmail, isLength } from "validator";
import { DonationCreator, DonationEntity, DonationFilters, DonationModel, DonationModifier } from "../models/Donation";
import { DonationService } from "../models/DonationService";
import { FieldErrorCode } from "../models/Errors";
import { Validator } from "../models/Validator";
import { BaseMongoService } from "./BaseMongoService";

@injectable()
export class MongoDonationService
  extends BaseMongoService<DonationEntity, DonationModel, DonationFilters, DonationCreator, DonationModifier>
  implements DonationService {
  protected static collectionName = "donations";

  protected async initiate(): Promise<void> {
    const hasSearchIndex = await this.collection.indexExists("donation_search");
    if (!hasSearchIndex) {
      await this.collection.createIndex({ fullName: "text", email: "text" }, { name: "donation_search" });
    }
  }

  protected async createEntity(creator: DonationCreator): Promise<DonationEntity> {
    const fromSuper = await super.createEntity(creator);
    return {
      ...fromSuper,
      ...creator,
      paymentConfirmed: false,
      packageId: new ObjectId(creator.packageId),
      parentDonationId: creator.parentDonationId !== undefined ? new ObjectId(creator.parentDonationId) : undefined,
      date: new Date()
    };
  }

  protected creatorValidator: Validator<DonationCreator> = {
    email: async value => {
      if (!isEmail(value)) return [FieldErrorCode.INVALID_EMAIL];
      return null;
    },
    fullName: async value => {
      if (!isAlpha(value.replace(/[ .]/g, ""))) return [FieldErrorCode.INVALID_NAME];
      else if (!isLength(value, { min: 1, max: 100 })) return [FieldErrorCode.INVALID_EMAIL];
      return null;
    },
    quantity: async value => {
      if (value <= 0) return [FieldErrorCode.INVALID_QUANTITY];
      return null;
    },
    customPriceAmount: async value => {
      if (value && value <= 0) return [FieldErrorCode.INVALID_AMOUNT];
      return null;
    }
  };

  protected getFilters = ({ paymentConfirmed, ids, search, packageId, onlyDirect }: DonationFilters): object[] => {
    return [
      paymentConfirmed === undefined || paymentConfirmed === null ? undefined : { paymentConfirmed },
      ids !== undefined ? { _id: { $in: ids.map(id => new ObjectId(id)) } } : undefined,
      search !== undefined ? { $text: { $search: search } } : undefined,
      onlyDirect === false ? undefined : { parentDonationId: { $exists: false } },
      packageId !== undefined ? { packageId: new ObjectId(packageId) } : undefined
    ].filter(el => el !== undefined) as any;
  };

  protected toModel = (entity: DonationEntity): DonationModel => {
    return {
      id: entity._id.toString(),
      date: entity.date,
      email: entity.email,
      fullName: entity.fullName,
      packageId: entity.packageId.toString(),
      notes: entity.notes,
      paymentConfirmed: entity.paymentConfirmed,
      quantity: entity.quantity,
      usingAmex: entity.usingAmex,
      parentDonationId: entity.parentDonationId !== undefined ? entity.parentDonationId.toString() : undefined
    };
  };

  public cleanPendingDonations = async (): Promise<number> => {
    const result = await this.collection.deleteMany({
      paymentConfirmed: false,
      date: { $lt: subHours(new Date(), 1) }
    });
    return result.deletedCount || 0;
  };

  public confirmPayment = async (donationId: string): Promise<DonationModel | null> => {
    return this.edit({ id: donationId, paymentConfirmed: true });
  };

  public countByPackageId = (packageId: string): Promise<number> => {
    return this.collection.find({ packageId: new ObjectId(packageId) }).count();
  };

  public getByPackageId = async (packageId: string): Promise<DonationModel[]> => {
    const results = await this.collection.find({ packageId: new ObjectId(packageId) }).toArray();
    return results.map(this.toModel);
  };
}
