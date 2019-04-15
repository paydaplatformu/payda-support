import { inject, injectable } from "inversify";
import { IPackageService } from "../models/PackageService";
import { PaginationSettings } from "../models/PaginationSettings";
import { RepeatInterval } from "../models/RepeatInterval";
import { SortingSettings } from "../models/SortingSettings";
import { IRunningSubscription, ISubscriptionFilters } from "../models/Subscription";
import { ISubscriptionManagerService } from "../models/SubscriptionManagerService";
import { ISubscriptionService } from "../models/SubscriptionService";
import { TYPES } from "../types";

@injectable()
export class SubscriptionManagerService implements ISubscriptionManagerService {
  @inject(TYPES.IPackageService)
  private packageService: IPackageService = null as any;

  @inject(TYPES.ISubscriptionService)
  private subscriptionService: ISubscriptionService = null as any;

  public getChargableSubscriptions = async (
    repeatInterval: RepeatInterval,
    filters: ISubscriptionFilters,
    pagination: PaginationSettings,
    sorting: SortingSettings
  ): Promise<IRunningSubscription[]> => {
    const allowedPackages = await this.packageService.getByRepeatInterval(repeatInterval);
    const allowedPackageIds = allowedPackages.map(p => p.id);
    return this.subscriptionService.getByChargableSubscriptionsForRepeatIntervalAndPackageIds(
      repeatInterval,
      allowedPackageIds,
      filters,
      pagination,
      sorting
    );
  };

  public countChargableSubscriptions = async (
    repeatInterval: RepeatInterval,
    filters: ISubscriptionFilters
  ): Promise<number> => {
    const allowedPackages = await this.packageService.getByRepeatInterval(repeatInterval);
    const allowedPackageIds = allowedPackages.map(p => p.id);
    return this.subscriptionService.countChargableSubscriptionsForRepeatIntervalAndPackageIds(
      repeatInterval,
      allowedPackageIds,
      filters
    );
  };

  public getChargableSubscriptionById = async (
    id: string,
    repeatInterval: RepeatInterval
  ): Promise<IRunningSubscription | null> => {
    const allowedPackages = await this.packageService.getByRepeatInterval(repeatInterval);
    const allowedPackageIds = allowedPackages.map(p => p.id);
    return this.subscriptionService.getByIdForRepeatIntervalAndPackageIds(id, repeatInterval, allowedPackageIds);
  };
}
