import { inject, injectable } from "inversify";
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

@injectable()
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
    const pkg = await this.getPackageForDonationCreator(donationCreator);
    const donation = await this.donationService.create(donationCreator as IDonationCreator);
    const subscription = await this.getSubscription(donation, pkg, language);
    const formFields = await this.payuService.getFormContents(donation, pkg, language);
    return {
      donation,
      subscription,
      formUrl: config.get("payu.luUrl"),
      formFields,
      package: pkg
    };
  }

  private async getPackageForDonationCreator(donationCreator: IDonationCreator) {
    const pkg = await this.packageService.getById(donationCreator.packageId);
    if (!pkg) throw new Error("Package does not exist, cannot create donation.");

    if (pkg.isCustomizable && donationCreator.customPrice) {
      if (this.packageService.isCustomPrice(pkg.price, donationCreator.customPrice)) {
        return this.packageService.create({
          isCustomizable: false,
          defaultTag: pkg.defaultTag,
          image: pkg.image,
          price: donationCreator.customPrice,
          priority: pkg.priority,
          reference: pkg.reference,
          repeatConfig: pkg.repeatConfig,
          tags: pkg.tags,
          isCustom: true
        });
      }
    }
    return pkg;
  }

  private async getSubscription(
    donation: IDonation,
    pkg: IPackage,
    language: LanguageCode
  ): Promise<ISubscription | undefined> {
    if (pkg.repeatConfig !== RepeatConfig.NONE) {
      return this.subscriptionService.create({
        donationId: donation.id,
        packageId: pkg.id,
        language
      });
    }
    return undefined;
  }
}
