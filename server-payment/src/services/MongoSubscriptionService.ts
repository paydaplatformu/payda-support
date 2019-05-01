import { startOfMonth, startOfYear, subMonths, subYears } from "date-fns";
import { injectable } from "inversify";
import { ObjectId } from "mongodb";
import { DeactivationReason } from "../models/DeactivationReason";
import { PaginationSettings } from "../models/PaginationSettings";
import { RepeatInterval } from "../models/RepeatInterval";
import { SortingSettings } from "../models/SortingSettings";
import {
  RunningSubscriptionModel,
  SubscriptionCreator,
  SubscriptionEntity,
  SubscriptionFilters,
  SubscriptionModel,
  SubscriptionModifier
} from "../models/Subscription";
import { SubscriptionService } from "../models/SubscriptionService";
import { SubscriptionStatus } from "../models/SubscriptionStatus";
import { Validator } from "../models/Validator";
import { BaseMongoService } from "./BaseMongoService";

@injectable()
export class MongoSubscriptionService
  extends BaseMongoService<
    SubscriptionEntity,
    SubscriptionModel,
    SubscriptionFilters,
    SubscriptionCreator,
    SubscriptionModifier
  >
  implements SubscriptionService {
  private generateByRepeatIntervalAndPackageIdsFilters = (
    repeatInterval: RepeatInterval,
    packageIds: string[]
  ): object[] => {
    const now = new Date();
    const packageIdsConverted = packageIds.map(id => new ObjectId(id));
    switch (repeatInterval) {
      case RepeatInterval.YEARLY:
        return this.generateDateWithPackageIdFilters(packageIdsConverted, now, subYears, startOfYear);
      case RepeatInterval.MONTHLY:
        return this.generateDateWithPackageIdFilters(packageIdsConverted, now, subMonths, startOfMonth);
      default:
        throw new Error("Unknown repeat config.");
    }
  };

  private generateDateWithPackageIdFilters = (
    packageIds: ObjectId[],
    now: Date,
    subtractionFunction: (date: Date, amount: number) => Date,
    startFunction: (date: Date) => Date
  ): object[] => {
    const previous = subtractionFunction(now, 1);
    const currentStart = startFunction(now);
    const previousStart = startFunction(previous);
    return this.getChargableQueryForDateFilters(packageIds, currentStart, previousStart);
  };

  private getChargableQueryForDateFilters = (
    packageIds: ObjectId[],
    lessThan: Date,
    greaterThanOrEqual: Date
  ): object[] => {
    return [
      {
        status: SubscriptionStatus.RUNNING
      },
      { packageId: { $in: packageIds } },
      {
        processHistory: {
          $exists: true,
          $ne: [],
          $elemMatch: { date: { $lt: lessThan, $gte: greaterThanOrEqual }, isSuccess: true }
        }
      }
    ];
  };

  private getEntityByDonationId = (donationId: string): Promise<SubscriptionEntity | null> => {
    return this.collection.findOne({ donationId: new ObjectId(donationId) });
  };

  protected static collectionName = "subscriptions";

  protected creatorValidator: Validator<SubscriptionCreator> = {};

  protected toModel = (entity: SubscriptionEntity): SubscriptionModel => {
    return {
      id: entity._id.toString(),
      packageId: entity.packageId.toString(),
      donationId: entity.packageId.toString(),
      processHistory: entity.processHistory,
      deactivationReason: entity.deactivationReason as any,
      status: entity.status as any,
      language: entity.language,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      hasPaymentToken: entity.paymentToken !== null
    };
  };

  protected async createEntity(creator: SubscriptionCreator): Promise<SubscriptionEntity> {
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

  public cancelSubscription = (id: string) => {
    return this.edit({ id, status: SubscriptionStatus.CANCELLED, deactivationReason: DeactivationReason.USER_REQUEST });
  };

  public getByDonationId = async (donationId: string): Promise<SubscriptionModel | null> => {
    const result = await this.getEntityByDonationId(donationId);
    if (result) {
      return this.toModel(result);
    }
    return null;
  };

  public getByChargableSubscriptionsForRepeatIntervalAndPackageIds = async (
    repeatInterval: RepeatInterval,
    packageIds: string[],
    filters: SubscriptionFilters,
    pagination: PaginationSettings,
    sorting: SortingSettings
  ): Promise<RunningSubscriptionModel[]> => {
    const extraFilters = this.generateByRepeatIntervalAndPackageIdsFilters(repeatInterval, packageIds);
    const subscriptions = await this.getAll(filters, pagination, sorting, extraFilters);
    return subscriptions.filter<RunningSubscriptionModel>(this.isRunningSubscription);
  };

  public getByIdForRepeatIntervalAndPackageIds = async (
    id: string,
    repeatInterval: RepeatInterval,
    packageIds: string[]
  ): Promise<RunningSubscriptionModel | null> => {
    const extraFilters = this.generateByRepeatIntervalAndPackageIdsFilters(repeatInterval, packageIds);
    const subscriptions = await this.getAll({ ids: [id] }, undefined, undefined, extraFilters);
    if (subscriptions.length === 0) return null;
    else if (subscriptions.length > 1) throw new Error("Conflicting ids for subscriptions");
    const head = subscriptions[0];
    if (!this.isRunningSubscription(head)) throw new Error("Unexpected subscription");
    return head;
  };

  public countChargableSubscriptionsForRepeatIntervalAndPackageIds = async (
    repeatInterval: RepeatInterval,
    packageIds: string[],
    filters: SubscriptionFilters
  ): Promise<number> => {
    const extraFilters = this.generateByRepeatIntervalAndPackageIdsFilters(repeatInterval, packageIds);
    return this.count(filters, extraFilters);
  };

  public async getPaymentTokenById(id: string): Promise<string | null> {
    const entity = await super.getEntityById(id);
    if (!entity) return null;
    return entity.paymentToken;
  }

  protected getFilters = ({ ids, status }: SubscriptionFilters): object[] => {
    return [
      status !== undefined ? { status } : undefined,
      ids !== undefined ? { _id: { $in: ids.map(id => new ObjectId(id)) } } : undefined
    ].filter(el => el !== undefined) as any;
  };

  public isRunningSubscription = (subscription: SubscriptionModel): subscription is RunningSubscriptionModel =>
    subscription.status === SubscriptionStatus.RUNNING;
}
