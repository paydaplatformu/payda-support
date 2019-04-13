import { PaginationSettings } from "./PaginationSettings";
import { RepeatConfig } from "./RepeatConfig";
import { SortingSettings } from "./SortingSettings";
import {
  IRunningSubscription,
  ISubscription,
  ISubscriptionCreator,
  ISubscriptionEntity,
  ISubscriptionFilters,
  ISubscriptionModifier
} from "./Subscription";

export interface ISubscriptionService {
  getAll(
    filters: ISubscriptionFilters,
    pagination: PaginationSettings,
    sorting: SortingSettings
  ): Promise<ISubscription[]>;
  getByChargableSubscriptionsForRepeatConfigAndPackageIds(
    repeatConfig: RepeatConfig,
    packageIds: string[],
    filters: ISubscriptionFilters,
    pagination: PaginationSettings,
    sorting: SortingSettings
  ): Promise<IRunningSubscription[]>;
  getByIdForRepeatConfigAndPackageIds(
    id: string,
    repeatConfig: RepeatConfig,
    packageIds: string[]
  ): Promise<IRunningSubscription | null>;
  countChargableSubscriptionsForRepeatConfigAndPackageIds(
    repeatConfig: RepeatConfig,
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
