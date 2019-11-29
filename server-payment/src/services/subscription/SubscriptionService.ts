import { PaginationSettings } from "../../models/PaginationSettings";
import { SortingSettings } from "../../models/SortingSettings";
import { SubscriptionCreator, SubscriptionModifier, RunningSubscription } from "../../models/Subscription";
import { RepeatInterval, Subscription, SubscriptionFilter } from "../../generated/graphql";

export interface SubscriptionService {
  getAll(
    filters: Partial<SubscriptionFilter>,
    pagination: PaginationSettings | null,
    sorting: SortingSettings | null
  ): Promise<Subscription[]>;
  getByChargableSubscriptionsForRepeatIntervalAndPackageIds(
    repeatInterval: RepeatInterval,
    packageIds: string[],
    filters: SubscriptionFilter | null,
    pagination: PaginationSettings | null,
    sorting: SortingSettings | null
  ): Promise<RunningSubscription[]>;
  getByIdForRepeatIntervalAndPackageIds(
    id: string,
    repeatInterval: RepeatInterval,
    packageIds: string[]
  ): Promise<RunningSubscription | null>;
  countChargableSubscriptionsForRepeatIntervalAndPackageIds(
    repeatInterval: RepeatInterval,
    packageIds: string[],
    filters: SubscriptionFilter | null
  ): Promise<number>;
  count(filters: Partial<SubscriptionFilter>): Promise<number>;
  getById(id: string): Promise<Subscription | null>;
  getPaymentTokenById(id: string): Promise<string | null>;
  getByDonationId(donationId: string): Promise<Subscription | null>;
  create(SubscriptionCreator: SubscriptionCreator): Promise<Subscription>;
  edit(SubscriptionModifier: SubscriptionModifier): Promise<Subscription | null>;
  cancelSubscription(id: string): Promise<Subscription | null>;
  isRunningSubscription(subscription: Subscription): subscription is RunningSubscription;
}
