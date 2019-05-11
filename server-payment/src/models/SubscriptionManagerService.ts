import { PaginationSettings } from "./PaginationSettings";
import { RepeatInterval } from "./RepeatInterval";
import { SortingSettings } from "./SortingSettings";
import { RunningSubscriptionModel, SubscriptionFilters } from "./Subscription";

export interface SubscriptionManagerService {
  getChargableSubscriptions(
    repeatInterval: RepeatInterval,
    filters: SubscriptionFilters,
    pagination: PaginationSettings,
    sorting: SortingSettings
  ): Promise<RunningSubscriptionModel[]>;

  countChargableSubscriptions(repeatInterval: RepeatInterval, filters: SubscriptionFilters): Promise<number>;
  getChargableSubscriptionById(id: string): Promise<RunningSubscriptionModel | null>;

  isChargable(id: string): Promise<boolean>;
}
