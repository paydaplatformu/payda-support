import { injectable } from "inversify";
import { PaginationSettings } from "../models/PaginationSettings";
import { SortingSettings } from "../models/SortingSettings";
import {
  ISubscription,
  ISubscriptionCreator,
  ISubscriptionFilters,
  ISubscriptionModifier
} from "../models/Subscription";
import { ISubscriptionService } from "../models/SubscriptionService";
import { sortAndPaginate } from "../utilities/helpers";

@injectable()
export class MockSubscriptionService implements ISubscriptionService {
  private subscriptions: ISubscription[];
  constructor() {
    this.subscriptions = [];
  }

  public getAll = async (
    { onlyActive }: ISubscriptionFilters,
    pagination: PaginationSettings,
    sorting: SortingSettings
  ) => {
    let results = this.subscriptions;
    if (onlyActive) {
      results = this.subscriptions.filter(s => s.isActive);
    }
    return sortAndPaginate(results, pagination, sorting);
  };

  public count = async (filters: ISubscriptionFilters) => {
    const results = await this.getAll(
      filters,
      { page: 1, perPage: Number.MAX_SAFE_INTEGER },
      { sortOrder: "ASC", sortField: "id" }
    );
    return results.length;
  };

  public getById = async (id: string) => this.subscriptions.find(s => s.id === id) || null;

  public create = async (subscriptionCreator: ISubscriptionCreator) => {
    const newSubscription: ISubscription = {
      id: Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 5),
      createdAt: new Date(),
      updatedAt: new Date(),
      donationId: subscriptionCreator.donationId,
      packageId: subscriptionCreator.packageId,
      lastProcess: null,
      isActive: true
    };
    this.subscriptions.push(newSubscription);
    return newSubscription;
  };

  public edit = async (subscriptionModifier: ISubscriptionModifier) => {
    const current = await this.getById(subscriptionModifier.id);
    if (!current) return null;
    const next: ISubscription = {
      ...current,
      ...subscriptionModifier,
      lastProcess: (subscriptionModifier.lastProcess || current.lastProcess) as any
    };
    this.subscriptions = this.subscriptions.filter(s => s.id !== subscriptionModifier.id).concat([next]);
    return next;
  };
}
