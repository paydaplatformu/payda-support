import {
  startOfHour,
  startOfMinute,
  startOfMonth,
  startOfYear,
  subHours,
  subMinutes,
  subMonths,
  subYears
} from "date-fns";
import { injectable } from "inversify";
import { ObjectId, WithId } from "mongodb";
import { PaginationSettings } from "../../models/PaginationSettings";
import { SortingSettings } from "../../models/SortingSettings";
import {
  RunningSubscription,
  SubscriptionCreator,
  SubscriptionEntity,
  SubscriptionModifier
} from "../../models/Subscription";
import { SubscriptionService } from "./SubscriptionService";
import { Validator } from "../../models/Validator";
import { BaseMongoService } from "../BaseMongoService";
import {
  RepeatInterval,
  SubscriptionStatus,
  DeactivationReason,
  Subscription,
  SubscriptionFilter,
  ChargableSubscriptionFilter
} from "../../generated/graphql";
import { isDefined } from "../../utilities/helpers";

@injectable()
export class MongoSubscriptionService
  extends BaseMongoService<
    SubscriptionEntity,
    Subscription,
    SubscriptionFilter,
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
      case RepeatInterval.Yearly:
        return this.generateDateWithPackageIdFilters(packageIdsConverted, now, subYears, startOfYear);
      case RepeatInterval.Monthly:
        return this.generateDateWithPackageIdFilters(packageIdsConverted, now, subMonths, startOfMonth);
      case RepeatInterval.TestA:
        return this.generateDateWithPackageIdFilters(packageIdsConverted, now, subHours, startOfHour);
      case RepeatInterval.TestB:
        return this.generateDateWithPackageIdFilters(packageIdsConverted, now, subMinutes, startOfMinute);
      default:
        throw new Error("Unknown repeat interval.");
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
        status: SubscriptionStatus.Running
      },
      { packageId: { $in: packageIds } },
      {
        processHistory: {
          $exists: true,
          $ne: [],
          $elemMatch: { date: { $lt: lessThan, $gte: greaterThanOrEqual }, isSuccess: true }
        }
      },
      {
        processHistory: {
          $not: {
            $exists: true,
            $ne: [],
            $elemMatch: { date: { $gt: lessThan } }
          }
        }
      }
    ];
  };

  private getEntityByDonationId = (donationId: string): Promise<SubscriptionEntity | null> => {
    return this.collection.findOne({ donationId: new ObjectId(donationId) });
  };

  protected static collectionName = "subscriptions";

  protected creatorValidator: Validator<SubscriptionCreator> = {};

  protected toModel = (entity: WithId<SubscriptionEntity>): Subscription => {
    return {
      id: entity._id.toString(),
      packageId: entity.packageId.toString(),
      donationId: entity.donationId.toString(),
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
      status: SubscriptionStatus.Created,
      donationId: new ObjectId(creator.donationId),
      packageId: new ObjectId(creator.packageId),
      processHistory: [],
      deactivationReason: null,
      paymentToken: null
    };
  }

  public cancelSubscription = (id: string) => {
    return this.edit(id, { status: SubscriptionStatus.Cancelled, deactivationReason: DeactivationReason.UserRequest });
  };

  public getByDonationId = async (donationId: string): Promise<Subscription | null> => {
    const result = await this.getEntityByDonationId(donationId);
    if (result) {
      return this.toModel(result);
    }
    return null;
  };

  public getByChargableSubscriptionsForRepeatIntervalAndPackageIds = async (
    packageIds: string[],
    filters: ChargableSubscriptionFilter,
    pagination: PaginationSettings,
    sorting: SortingSettings
  ): Promise<RunningSubscription[]> => {
    const extraFilters = this.generateByRepeatIntervalAndPackageIdsFilters(filters.repeatInterval, packageIds);
    const subscriptions = await this.getAll(filters, pagination, sorting, extraFilters);
    return subscriptions.filter<RunningSubscription>(this.isRunningSubscription);
  };

  public getByIdForRepeatIntervalAndPackageIds = async (
    id: string,
    repeatInterval: RepeatInterval,
    packageIds: string[]
  ): Promise<RunningSubscription | null> => {
    const extraFilters = this.generateByRepeatIntervalAndPackageIdsFilters(repeatInterval, packageIds);
    const subscriptions = await this.getAll({ ids: [id] }, null, null, extraFilters);
    if (subscriptions.length === 0) return null;
    else if (subscriptions.length > 1) throw new Error("Conflicting ids for subscriptions");
    const head = subscriptions[0];
    if (!this.isRunningSubscription(head)) throw new Error("Unexpected subscription");
    return head;
  };

  public countChargableSubscriptionsForRepeatIntervalAndPackageIds = async (
    packageIds: string[],
    filters: ChargableSubscriptionFilter
  ): Promise<number> => {
    const extraFilters = this.generateByRepeatIntervalAndPackageIdsFilters(filters.repeatInterval, packageIds);
    return this.count(filters, extraFilters);
  };

  public getPaymentTokenById = async (id: string): Promise<string | null> => {
    const entity = await this.getEntityById(id);
    if (!entity) return null;
    return entity.paymentToken;
  };

  protected getFilters = (filter: Partial<SubscriptionFilter>): object[] => {
    const { ids, status, hasPaymentToken } = filter || {};
    return [
      status !== undefined ? { status } : undefined,
      hasPaymentToken !== true ? undefined : { paymentToken: { $exists: true, $ne: null } },
      isDefined(ids) ? { _id: { $in: ids.map(id => new ObjectId(id)) } } : undefined
    ].filter(el => el !== undefined) as any;
  };

  public isRunningSubscription = (subscription: Subscription): subscription is RunningSubscription =>
    subscription.status === SubscriptionStatus.Running;
}
