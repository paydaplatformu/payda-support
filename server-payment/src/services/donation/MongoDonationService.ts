import { subHours } from "date-fns";
import { injectable } from "inversify";
import { ObjectId, WithId } from "mongodb";
import validator from "validator";
import { DonationEntity, DonationModifier, DonationCreator } from "../../models/Donation";
import { DonationService } from "./DonationService";
import { FieldErrorCode } from "../../models/Errors";
import { Validator } from "../../models/Validator";
import { BaseMongoService } from "../BaseMongoService";
import { Donation, DonationFilter } from "../../generated/graphql";
import { isDefined } from "../../utilities/helpers";

@injectable()
export class MongoDonationService
  extends BaseMongoService<DonationEntity, Donation, DonationFilter, DonationCreator, DonationModifier>
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
      date: new Date(),
    };
  }

  protected creatorValidator: Validator<DonationCreator> = {
    email: async (value) => {
      if (!validator.isEmail(value)) return [FieldErrorCode.INVALID_EMAIL];
      return null;
    },
    fullName: async (value) => {
      if (!validator.isAlpha(value.replace(/[ .]/g, ""))) return [FieldErrorCode.INVALID_NAME];
      else if (!validator.isLength(value, { min: 1, max: 100 })) return [FieldErrorCode.INVALID_EMAIL];
      return null;
    },
    quantity: async (value) => {
      if (value <= 0) return [FieldErrorCode.INVALID_QUANTITY];
      return null;
    },
    customPriceAmount: async (value) => {
      if (value && value <= 0) return [FieldErrorCode.INVALID_AMOUNT];
      return null;
    },
  };

  protected getFilters = (filter: Partial<DonationFilter>): object[] => {
    const { paymentConfirmed, ids, search, packageId, onlyDirect } = filter || {};
    return [
      paymentConfirmed === undefined || paymentConfirmed === null ? undefined : { paymentConfirmed },
      isDefined(ids) ? { _id: { $in: ids.map((id) => new ObjectId(id)) } } : undefined,
      search !== undefined ? { $text: { $search: search } } : undefined,
      onlyDirect === true ? { parentDonationId: null } : undefined,
      packageId !== undefined ? { packageId: packageId === null ? null : new ObjectId(packageId) } : undefined,
    ].filter((el) => el !== undefined) as any;
  };

  protected toModel = (entity: WithId<DonationEntity>): Donation => {
    return {
      id: entity._id.toString(),
      date: entity.date,
      email: entity.email,
      fullName: entity.fullName,
      ip: entity.ip,
      packageId: entity.packageId.toString(),
      notes: entity.notes,
      paymentConfirmed: entity.paymentConfirmed,
      quantity: entity.quantity,
      parentDonationId: entity?.parentDonationId?.toString() || null,
    };
  };

  public cleanPendingDonations = async (): Promise<number> => {
    const result = await this.collection.deleteMany({
      paymentConfirmed: false,
      date: { $lt: subHours(new Date(), 1) },
    });
    return result.deletedCount || 0;
  };

  public confirmPayment = async (donationId: string): Promise<Donation | null> => {
    return this.edit(donationId, { paymentConfirmed: true });
  };

  public countByPackageId = (packageId: string): Promise<number> => {
    return this.collection.find({ packageId: new ObjectId(packageId) }).count();
  };

  public getByPackageId = async (packageId: string): Promise<Donation[]> => {
    const results = await this.collection.find({ packageId: new ObjectId(packageId) }).toArray();
    return results.map(this.toModel);
  };
}
