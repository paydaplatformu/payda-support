import { inject, injectable } from "inversify";
import { PackageService } from "../package/PackageService";
import { PaginationSettings } from "../../models/PaginationSettings";
import { SortingSettings } from "../../models/SortingSettings";
import { RunningSubscription } from "../../models/Subscription";
import { SubscriptionManagerService } from "./SubscriptionManagerService";
import { SubscriptionService } from "../subscription/SubscriptionService";
import { TYPES } from "../../types";
import { RepeatInterval, SubscriptionFilter } from "../../generated/graphql";

@injectable()
export class SubscriptionManagerServiceImpl implements SubscriptionManagerService {
  @inject(TYPES.PackageService)
  private packageService: PackageService = null as any;

  @inject(TYPES.SubscriptionService)
  private subscriptionService: SubscriptionService = null as any;

  public getChargableSubscriptions = async (
    filters: SubscriptionFilter,
    pagination: PaginationSettings,
    sorting: SortingSettings
  ): Promise<RunningSubscription[]> => {
    const allowedPackages = await this.packageService.getByRepeatInterval(filters.repeatInterval);
    const allowedPackageIds = allowedPackages.map(p => p.id);
    return this.subscriptionService.getByChargableSubscriptionsForRepeatIntervalAndPackageIds(
      allowedPackageIds,
      filters,
      pagination,
      sorting
    );
  };

  public countChargableSubscriptions = async (filters: SubscriptionFilter): Promise<number> => {
    const allowedPackages = await this.packageService.getByRepeatInterval(filters.repeatInterval);
    const allowedPackageIds = allowedPackages.map(p => p.id);
    return this.subscriptionService.countChargableSubscriptionsForRepeatIntervalAndPackageIds(
      allowedPackageIds,
      filters
    );
  };

  public getChargableSubscriptionById = async (id: string): Promise<RunningSubscription | null> => {
    const subscription = await this.subscriptionService.getById(id);
    if (!subscription) return null;

    const pkg = await this.packageService.getById(subscription.packageId);
    if (!pkg) throw new Error("Inconsistent state, subscription does not have a package");

    const repeatInterval = pkg.repeatInterval;

    const allowedPackages = await this.packageService.getByRepeatInterval(repeatInterval);
    const allowedPackageIds = allowedPackages.map(p => p.id);

    return this.subscriptionService.getByIdForRepeatIntervalAndPackageIds(id, repeatInterval, allowedPackageIds);
  };

  public isChargable = async (id: string) => {
    const subscription = await this.getChargableSubscriptionById(id);
    if (subscription) return true;
    return false;
  };
}
