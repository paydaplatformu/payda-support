import { PaginationSettings } from "./PaginationSettings";
import { RepeatInterval } from "./RepeatInterval";
import { SortingSettings } from "./SortingSettings";
import {
  IRunningSubscription,
  ISubscription,
  ISubscriptionCreator,
  ISubscriptionFilters,
  ISubscriptionModifier
} from "./Subscription";

export interface ISubscriptionService {
  getAll(
    filters: ISubscriptionFilters,
    pagination: PaginationSettings,
    sorting: SortingSettings
  ): Promise<ISubscription[]>;
  getByChargableSubscriptionsForRepeatIntervalAndPackageIds(
    repeatInterval: RepeatInterval,
    packageIds: string[],
    filters: ISubscriptionFilters,
    pagination: PaginationSettings,
    sorting: SortingSettings
  ): Promise<IRunningSubscription[]>;
  getByIdForRepeatIntervalAndPackageIds(
    id: string,
    repeatInterval: RepeatInterval,
    packageIds: string[]
  ): Promise<IRunningSubscription | null>;
  countChargableSubscriptionsForRepeatIntervalAndPackageIds(
    repeatInterval: RepeatInterval,
    packageIds: string[],
    filters: ISubscriptionFilters
  ): Promise<number>;
  count(filters: ISubscriptionFilters): Promise<number>;
  getById(id: string): Promise<ISubscription | null>;
  getPaymentTokenById(id: string): Promise<string | null>;
  getByDonationId(donationId: string): Promise<ISubscription | null>;
  create(SubscriptionCreator: ISubscriptionCreator): Promise<ISubscription>;
  edit(SubscriptionModifier: ISubscriptionModifier): Promise<ISubscription | null>;
  cancelSubscription(id: string): Promise<ISubscription | null>;
  isRunningSubscription(subscription: ISubscription): subscription is IRunningSubscription;
}
