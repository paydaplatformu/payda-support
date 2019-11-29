import { PaginationSettings } from "../../models/PaginationSettings";
import { SortingSettings } from "../../models/SortingSettings";
import { RunningSubscription } from "../../models/Subscription";
import { SubscriptionFilter } from "../../generated/graphql";

export interface SubscriptionManagerService {
  getChargableSubscriptions(
    filters: Partial<SubscriptionFilter>,
    pagination: PaginationSettings | null,
    sorting: SortingSettings | null
  ): Promise<RunningSubscription[]>;

  countChargableSubscriptions(filters: Partial<SubscriptionFilter>): Promise<number>;
  getChargableSubscriptionById(id: string): Promise<RunningSubscription | null>;

  isChargable(id: string): Promise<boolean>;
}
