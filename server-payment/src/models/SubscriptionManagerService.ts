import { PaginationSettings } from "./PaginationSettings";
import { RepeatInterval } from "./RepeatInterval";
import { SortingSettings } from "./SortingSettings";
import { IRunningSubscription, ISubscriptionFilters } from "./Subscription";

export interface ISubscriptionManagerService {
  getChargableSubscriptions(
    repeatInterval: RepeatInterval,
    filters: ISubscriptionFilters,
    pagination: PaginationSettings,
    sorting: SortingSettings
  ): Promise<IRunningSubscription[]>;

  countChargableSubscriptions(repeatInterval: RepeatInterval, filters: ISubscriptionFilters): Promise<number>;
  getChargableSubscriptionById(id: string, repeatInterval: RepeatInterval): Promise<IRunningSubscription | null>;
}
