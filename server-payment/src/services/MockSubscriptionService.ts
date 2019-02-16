import { injectable } from "inversify";
import { PaginationSettings } from "../models/PaginationSettings";
import { SortingSettings } from "../models/SortingSettings";
import {
  IRunningSubscription,
  ISubscription,
  ISubscriptionCreator,
  ISubscriptionFilters,
  ISubscriptionModifier
} from "../models/Subscription";
import { ISubscriptionService } from "../models/SubscriptionService";
import { SubscriptionStatus } from "../models/SubscriptionStatus";
import { sortAndPaginate } from "../utilities/helpers";

@injectable()
export class MockSubscriptionService implements ISubscriptionService {
  private subscriptions: ISubscription[];
  constructor() {
    this.subscriptions = [];
  }

  public getRunningSubscriptions = async (
    pagination: PaginationSettings,
    sorting: SortingSettings
  ): Promise<IRunningSubscription[]> => {
    return this.getAll({ status: SubscriptionStatus.RUNNING }, pagination, sorting) as Promise<IRunningSubscription[]>;
  };

  public countRunningSubscriptions = async (): Promise<number> => {
    return this.count({ status: SubscriptionStatus.RUNNING });
  };

  public getEntityById = async (id: string): Promise<any> => {
    return this.getById(id);
  };

  public getRunningSubscriptionById = async (id: string): Promise<IRunningSubscription | null> => {
    const entity = await this.getById(id);
    if (!entity || entity.status !== SubscriptionStatus.RUNNING) return null;
    return entity;
  };

  public getAll = async (
    { status }: ISubscriptionFilters,
    pagination: PaginationSettings,
    sorting: SortingSettings
  ) => {
    let results = this.subscriptions;
    if (status) {
      results = this.subscriptions.filter(s => s.status === status);
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

  public getByDonationId = async (donationId: string) =>
    this.subscriptions.find(s => s.donationId === donationId) || null;

  public create = async (subscriptionCreator: ISubscriptionCreator) => {
    const newSubscription: ISubscription = {
      id: Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 5),
      createdAt: new Date(),
      updatedAt: new Date(),
      language: subscriptionCreator.language,
      donationId: subscriptionCreator.donationId,
      packageId: subscriptionCreator.packageId,
      processHistory: [],
      deactivationReason: null,
      status: SubscriptionStatus.CREATED
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
      status: (subscriptionModifier.status || current.status) as any,
      deactivationReason: (subscriptionModifier.deactivationReason || current.deactivationReason) as any
    };
    this.subscriptions = this.subscriptions.filter(s => s.id !== subscriptionModifier.id).concat([next]);
    return next;
  };
}
