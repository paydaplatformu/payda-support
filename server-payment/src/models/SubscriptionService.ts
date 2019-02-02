import { ISubscription, ISubscriptionCreator, ISubscriptionModifier, ISubscriptionFilters } from "./Subscription";
import { PaginationSettings } from "./PaginationSettings";
import { SortingSettings } from "./SortingSettings";

export interface ISubscriptionService {
  getAll(
    filters: ISubscriptionFilters,
    pagination: PaginationSettings,
    sorting: SortingSettings
  ): Promise<ISubscription[]>;
  count(filters: ISubscriptionFilters): Promise<number>;
  getById(id: string): Promise<ISubscription | null>;
  create(SubscriptionCreator: ISubscriptionCreator): Promise<ISubscription>;
  edit(SubscriptionModifier: ISubscriptionModifier): Promise<ISubscription | null>;
}
