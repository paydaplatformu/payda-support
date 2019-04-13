import { PaginationSettings } from "./PaginationSettings";
import { RepeatConfig } from "./RepeatConfig";
import { SortingSettings } from "./SortingSettings";
import { IRunningSubscription, ISubscriptionFilters } from "./Subscription";

export interface ISubscriptionManagerService {
  getChargableSubscriptions(
    repeatConfig: RepeatConfig,
    filters: ISubscriptionFilters,
    pagination: PaginationSettings,
    sorting: SortingSettings
  ): Promise<IRunningSubscription[]>;

  countChargableSubscriptions(repeatConfig: RepeatConfig, filters: ISubscriptionFilters): Promise<number>;
  getChargableSubscriptionById(id: string, repeatConfig: RepeatConfig): Promise<IRunningSubscription | null>;
}
