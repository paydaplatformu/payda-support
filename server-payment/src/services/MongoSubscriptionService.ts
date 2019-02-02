import { injectable } from "inversify";
import { Cursor, ObjectId } from "mongodb";
import {
  ISubscription,
  ISubscriptionCreator,
  ISubscriptionEntity,
  ISubscriptionFilters,
  ISubscriptionModifier
} from "../models/Subscription";
import { ISubscriptionService } from "../models/SubscriptionService";
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
  public static collectionName = "packages";

  public creatorValidator: Validator<ISubscriptionCreator> = {};

  public getFilteredQuery({ onlyActive, ids }: ISubscriptionFilters): Cursor<ISubscriptionEntity> {
    const filters = [
      onlyActive !== undefined ? { isActive: onlyActive } : undefined,
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
      donationId: new ObjectId(creator.donationId),
      packageId: new ObjectId(creator.packageId)
    };
  }

  public toModel(entity: ISubscriptionEntity): ISubscription {
    return {
      id: entity._id.toString(),
      packageId: entity.packageId.toString(),
      donationId: entity.packageId.toString(),
      lastProcess: entity.lastProcess,
      createdAt: entity.createdAt,
      isActive: entity.isActive,
      updatedAt: entity.updatedAt
    };
  }
}
