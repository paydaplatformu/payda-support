import { inject, injectable } from "inversify";
import { config } from "../config";
import { DonationModel, DonationCreator } from "../models/Donation";
import { DonationCreationResult } from "../models/DonationCreationResult";
import { DonationManagerService } from "../models/DonationManagerService";
import { IDonationService } from "../models/DonationService";
import { LanguageCode } from "../models/LanguageCode";
import { PackageModel } from "../models/Package";
import { PackageService } from "../models/PackageService";
import { PayuService } from "../models/PayuService";
import { RepeatInterval } from "../models/RepeatInterval";
import { SubscriptionModel } from "../models/Subscription";
import { SubscriptionService } from "../models/SubscriptionService";
import { TYPES } from "../types";

@injectable()
export class DonationManagerServiceImpl implements DonationManagerService {
  @inject(TYPES.IDonationService)
  private donationService: IDonationService = null as any;

  @inject(TYPES.PackageService)
  private packageService: PackageService = null as any;

  @inject(TYPES.PayuService)
  private payuService: PayuService = null as any;

  @inject(TYPES.SubscriptionService)
  private subscriptionService: SubscriptionService = null as any;

  private getPackageForDonationCreator = async (donationCreator: DonationCreator) => {
    const pkg = await this.packageService.getById(donationCreator.packageId);
    if (!pkg) throw new Error("Package does not exist, cannot create donation.");
    const priceAmount =
      pkg.customizationConfig.allowPriceAmountCustomization && donationCreator.customPriceAmount
        ? donationCreator.customPriceAmount
        : pkg.price.amount;

    const priceCurrency =
      pkg.customizationConfig.allowPriceCurrencyCustomization && donationCreator.customPriceCurrency
        ? donationCreator.customPriceCurrency
        : pkg.price.currency;

    const repeatInterval =
      pkg.customizationConfig.allowRepeatIntervalCustomization && donationCreator.customRepeatInterval
        ? donationCreator.customRepeatInterval
        : pkg.repeatInterval;

    const isCustom =
      priceAmount !== pkg.price.amount || priceCurrency !== pkg.price.currency || repeatInterval !== pkg.repeatInterval;

    if (isCustom) {
      return this.packageService.create({
        customizationConfig: {
          allowPriceAmountCustomization: false,
          allowPriceCurrencyCustomization: false,
          allowRepeatIntervalCustomization: false
        },
        defaultTag: pkg.defaultTag,
        image: pkg.image,
        price: {
          amount: priceAmount,
          currency: priceCurrency
        },
        priority: pkg.priority,
        reference: pkg.reference,
        repeatInterval,
        tags: pkg.tags,
        isCustom: true
      });
    }

    return pkg;
  };

  private getSubscription = async (
    donation: DonationModel,
    pkg: PackageModel,
    language: LanguageCode
  ): Promise<SubscriptionModel | undefined> => {
    if (pkg.repeatInterval !== RepeatInterval.NONE) {
      return this.subscriptionService.create({
        donationId: donation.id,
        packageId: pkg.id,
        language
      });
    }
    return undefined;
  };

  public createDonation = async (
    donationCreator: DonationCreator,
    language: LanguageCode
  ): Promise<DonationCreationResult> => {
    const pkg = await this.getPackageForDonationCreator(donationCreator);
    const donation = await this.donationService.create(donationCreator as DonationCreator);
    const subscription = await this.getSubscription(donation, pkg, language);
    const formFields = await this.payuService.getFormContents(donation, pkg, language);
    return {
      donation,
      subscription,
      formUrl: config.get("payu.luUrl"),
      formFields,
      package: pkg
    };
  };
}
