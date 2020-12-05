import { inject, injectable } from "inversify";
import { config } from "../../config";
import { DonationCreator } from "../../models/Donation";
import { DonationManagerService } from "./DonationManagerService";
import { DonationService } from "../donation/DonationService";
import { PackageService } from "../package/PackageService";
import { SubscriptionService } from "../subscription/SubscriptionService";
import { TYPES } from "../../types";
import {
  Donation,
  RepeatInterval,
  LanguageCode,
  Subscription,
  DonationCreationResult,
  Package,
} from "../../generated/graphql";
import { IyzicoService } from "../iyzico/IyzicoService";

@injectable()
export class DonationManagerServiceImpl implements DonationManagerService {
  @inject(TYPES.DonationService)
  private donationService: DonationService = null as any;

  @inject(TYPES.PackageService)
  private packageService: PackageService = null as any;

  @inject(TYPES.IyzicoService)
  private iyzicoService: IyzicoService = null as any;

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
          allowRepeatIntervalCustomization: false,
        },
        defaultTag: pkg.defaultTag,
        image: pkg.image,
        price: {
          amount: priceAmount,
          currency: priceCurrency,
        },
        priority: pkg.priority,
        reference: pkg.reference,
        repeatInterval,
        tags: pkg.tags,
        isCustom: true,
      });
    }

    return pkg;
  };

  private getSubscription = async (
    donation: Donation,
    pkg: Package,
    language: LanguageCode
  ): Promise<Subscription | null> => {
    if (pkg.repeatInterval !== RepeatInterval.None) {
      return this.subscriptionService.create({
        donationId: donation.id,
        packageId: pkg.id,
        language,
      });
    }
    return null;
  };

  public createDonation = async (
    donationCreator: DonationCreator,
    language: LanguageCode
  ): Promise<DonationCreationResult> => {
    const pkg = await this.getPackageForDonationCreator(donationCreator);
    const donation = await this.donationService.create({
      ...donationCreator,
      packageId: pkg.id,
    });
    const subscription = await this.getSubscription(donation, pkg, language);
    const formHtmlTags = await this.iyzicoService.getFormContents(donation, pkg, language);
    return {
      donation,
      subscription,
      formHtmlTags,
      package: pkg,
    };
  };
}
