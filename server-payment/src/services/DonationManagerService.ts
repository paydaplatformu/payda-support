import { inject } from "inversify";
import { config } from "../config";
import { IDonation, IDonationCreator } from "../models/Donation";
import { DonationCreationResult } from "../models/DonationCreationResult";
import { IDonationManagerService } from "../models/DonationManagerService";
import { IDonationService } from "../models/DonationService";
import { LanguageCode } from "../models/LanguageCode";
import { IPackage } from "../models/Package";
import { IPackageService } from "../models/PackageService";
import { IPayuService } from "../models/PayuService";
import { RepeatConfig } from "../models/RepeatConfig";
import { ISubscription } from "../models/Subscription";
import { ISubscriptionService } from "../models/SubscriptionService";
import { TYPES } from "../types";

export class DonationManagerService implements IDonationManagerService {
  @inject(TYPES.IDonationService)
  private donationService: IDonationService = null as any;

  @inject(TYPES.IPackageService)
  private packageService: IPackageService = null as any;

  @inject(TYPES.ISubscriptionService)
  private subscriptionService: ISubscriptionService = null as any;

  @inject(TYPES.IPayuService)
  private payuService: IPayuService = null as any;

  public async createDonation(
    donationCreator: IDonationCreator,
    language: LanguageCode
  ): Promise<DonationCreationResult> {
    const donation = await this.donationService.create(donationCreator as IDonationCreator);
    const pkg = await this.packageService.getById(donation.packageId);
    if (!pkg) throw new Error("If package does not exist, donation service create should have failed.");
    const subscription = await this.getSubscription(donation, pkg);
    const formFields = await this.payuService.getFormContents(donation, pkg, language);
    return {
      donation,
      subscription,
      formUrl: config.get("payu.url"),
      formFields,
      package: pkg
    };
  }

  private async getSubscription(donation: IDonation, pkg: IPackage): Promise<ISubscription | undefined> {
    if (pkg.repeatConfig !== RepeatConfig.NONE) {
      return this.subscriptionService.create({
        donationId: donation.id,
        packageId: pkg.id
      });
    }
    return undefined;
  }
}
