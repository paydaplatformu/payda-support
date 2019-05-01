import { PaginationSettings } from "./PaginationSettings";
import { RepeatInterval } from "./RepeatInterval";
import { SortingSettings } from "./SortingSettings";
import {
  RunningSubscriptionModel,
  SubscriptionModel,
  SubscriptionCreator,
  SubscriptionFilters,
  SubscriptionModifier
} from "./Subscription";

export interface SubscriptionService {
  getAll(
    filters: SubscriptionFilters,
    pagination: PaginationSettings,
    sorting: SortingSettings
  ): Promise<SubscriptionModel[]>;
  getByChargableSubscriptionsForRepeatIntervalAndPackageIds(
    repeatInterval: RepeatInterval,
    packageIds: string[],
    filters: SubscriptionFilters,
    pagination: PaginationSettings,
    sorting: SortingSettings
  ): Promise<RunningSubscriptionModel[]>;
  getByIdForRepeatIntervalAndPackageIds(
    id: string,
    repeatInterval: RepeatInterval,
    packageIds: string[]
  ): Promise<RunningSubscriptionModel | null>;
  countChargableSubscriptionsForRepeatIntervalAndPackageIds(
    repeatInterval: RepeatInterval,
    packageIds: string[],
    filters: SubscriptionFilters
  ): Promise<number>;
  count(filters: SubscriptionFilters): Promise<number>;
  getById(id: string): Promise<SubscriptionModel | null>;
  getPaymentTokenById(id: string): Promise<string | null>;
  getByDonationId(donationId: string): Promise<SubscriptionModel | null>;
  create(SubscriptionCreator: SubscriptionCreator): Promise<SubscriptionModel>;
  edit(SubscriptionModifier: SubscriptionModifier): Promise<SubscriptionModel | null>;
  cancelSubscription(id: string): Promise<SubscriptionModel | null>;
  isRunningSubscription(subscription: SubscriptionModel): subscription is RunningSubscriptionModel;
}
