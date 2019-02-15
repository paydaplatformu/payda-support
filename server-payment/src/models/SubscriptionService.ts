import { PaginationSettings } from "./PaginationSettings";
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
  getRunningSubscriptions(pagination: PaginationSettings, sorting: SortingSettings): Promise<IRunningSubscription[]>;
  count(filters: ISubscriptionFilters): Promise<number>;
  getById(id: string): Promise<ISubscription | null>;
  getEntityById(id: string): Promise<ISubscriptionEntity | null>;
  getByDonationId(donationId: string): Promise<ISubscription | null>;
  create(SubscriptionCreator: ISubscriptionCreator): Promise<ISubscription>;
  edit(SubscriptionModifier: ISubscriptionModifier): Promise<ISubscription | null>;
}
