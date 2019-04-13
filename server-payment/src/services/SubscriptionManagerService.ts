import { inject, injectable } from "inversify";
import { IPackageService } from "../models/PackageService";
import { PaginationSettings } from "../models/PaginationSettings";
import { RepeatConfig } from "../models/RepeatConfig";
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
    repeatConfig: RepeatConfig,
    filters: ISubscriptionFilters,
    pagination: PaginationSettings,
    sorting: SortingSettings
  ): Promise<IRunningSubscription[]> => {
    const allowedPackages = await this.packageService.getByRepeatConfig(repeatConfig);
    const allowedPackageIds = allowedPackages.map(p => p.id);
    return this.subscriptionService.getByChargableSubscriptionsForRepeatConfigAndPackageIds(
      repeatConfig,
      allowedPackageIds,
      filters,
      pagination,
      sorting
    );
  };

  public countChargableSubscriptions = async (
    repeatConfig: RepeatConfig,
    filters: ISubscriptionFilters
  ): Promise<number> => {
    const allowedPackages = await this.packageService.getByRepeatConfig(repeatConfig);
    const allowedPackageIds = allowedPackages.map(p => p.id);
    return this.subscriptionService.countChargableSubscriptionsForRepeatConfigAndPackageIds(
      repeatConfig,
      allowedPackageIds,
      filters
    );
  };

  public getChargableSubscriptionById = async (
    id: string,
    repeatConfig: RepeatConfig
  ): Promise<IRunningSubscription | null> => {
    const allowedPackages = await this.packageService.getByRepeatConfig(repeatConfig);
    const allowedPackageIds = allowedPackages.map(p => p.id);
    return this.subscriptionService.getByIdForRepeatConfigAndPackageIds(id, repeatConfig, allowedPackageIds);
  };
}
