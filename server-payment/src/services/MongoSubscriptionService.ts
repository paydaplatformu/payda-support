import { injectable } from "inversify";
import { Cursor, ObjectId } from "mongodb";
import { PaginationSettings } from "../models/PaginationSettings";
import { SortingSettings } from "../models/SortingSettings";
import {
  IRunningSubscription,
  ISubscription,
  ISubscriptionCreator,
  ISubscriptionEntity,
  ISubscriptionFilters,
  ISubscriptionModifier
} from "../models/Subscription";
import { ISubscriptionService } from "../models/SubscriptionService";
import { SubscriptionStatus } from "../models/SubscriptionStatus";
import { Validator } from "../models/Validator";
import { BaseMongoService } from "./BaseMongoService";

@injectable()
export class MongoSubscriptionService
  extends BaseMongoService<
    ISubscriptionEntity,
    ISubscription,
    ISubscriptionFilters,
    ISubscriptionCreator,
    ISubscriptionModifier
  >
  implements ISubscriptionService {
  public static collectionName = "subscriptions";

  public creatorValidator: Validator<ISubscriptionCreator> = {};

  public getRunningSubscriptions(
    pagination: PaginationSettings,
    sorting: SortingSettings
  ): Promise<IRunningSubscription[]> {
    return this.getAll({ status: SubscriptionStatus.RUNNING }, pagination, sorting) as Promise<IRunningSubscription[]>;
  }

  public getFilteredQuery({ ids, status }: ISubscriptionFilters): Cursor<ISubscriptionEntity> {
    const filters = [
      status !== undefined ? { status } : undefined,
      ids !== undefined ? { _id: { $in: ids.map(id => new ObjectId(id)) } } : undefined
    ].filter(el => el !== undefined);

    return this.collection.find({
      $and: filters
    });
  }

  public async createEntity(creator: ISubscriptionCreator): Promise<ISubscriptionEntity> {
    const fromSuper = await super.createEntity(creator);
    return {
      ...fromSuper,
      ...creator,
      status: SubscriptionStatus.CREATED,
      donationId: new ObjectId(creator.donationId),
      packageId: new ObjectId(creator.packageId),
      processHistory: [],
      deactivationReason: null,
      paymentToken: null
    };
  }

  private async getEntityByDonationId(donationId: string): Promise<ISubscriptionEntity | null> {
    return this.collection.findOne({ donationId: new ObjectId(donationId) });
  }

  public async getByDonationId(donationId: string): Promise<ISubscription | null> {
    const result = await this.getEntityByDonationId(donationId);
    if (result) {
      return this.toModel(result);
    }
    return null;
  }

  public toModel(entity: ISubscriptionEntity): ISubscription {
    return {
      id: entity._id.toString(),
      packageId: entity.packageId.toString(),
      donationId: entity.packageId.toString(),
      processHistory: entity.processHistory,
      deactivationReason: entity.deactivationReason as any,
      status: entity.status as any,
      language: entity.language,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }
}
