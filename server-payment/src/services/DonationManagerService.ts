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
import { RepeatInterval } from "../models/RepeatInterval";
import { ISubscription } from "../models/Subscription";
import { ISubscriptionService } from "../models/SubscriptionService";
import { TYPES } from "../types";

@injectable()
export class DonationManagerService implements IDonationManagerService {
  @inject(TYPES.IDonationService)
  private donationService: IDonationService = null as any;

  @inject(TYPES.IPackageService)
  private packageService: IPackageService = null as any;

  @inject(TYPES.IPayuService)
  private payuService: IPayuService = null as any;

  @inject(TYPES.ISubscriptionService)
  private subscriptionService: ISubscriptionService = null as any;

  private getPackageForDonationCreator = async (donationCreator: IDonationCreator) => {
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
    donation: IDonation,
    pkg: IPackage,
    language: LanguageCode
  ): Promise<ISubscription | undefined> => {
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
    donationCreator: IDonationCreator,
    language: LanguageCode
  ): Promise<DonationCreationResult> => {
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
  };
}
