import { inject, injectable } from "inversify";
import { Donation, DonationCreationResult, LanguageCode, Package, RepeatInterval } from "../../generated/graphql";
import { DonationCreator } from "../../models/Donation";
import { TYPES } from "../../types";
import { DonationService } from "../donation/DonationService";
import { IyzicoService } from "../iyzico/IyzicoService";
import { PackageService } from "../package/PackageService";
import { DonationManagerService } from "./DonationManagerService";

@injectable()
export class DonationManagerServiceImpl implements DonationManagerService {
  @inject(TYPES.DonationService)
  private donationService: DonationService = null as any;

  @inject(TYPES.PackageService)
  private packageService: PackageService = null as any;

  @inject(TYPES.IyzicoService)
  private iyzicoService: IyzicoService = null as any;

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
        : pkg.recurrenceConfig.repeatInterval;

    const isCustom =
      priceAmount !== pkg.price.amount ||
      priceCurrency !== pkg.price.currency ||
      repeatInterval !== pkg.recurrenceConfig.repeatInterval;

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
        recurrenceConfig: {
          count: pkg.recurrenceConfig.count,
          repeatInterval,
        },
        tags: pkg.tags,
        isCustom: true,
      });
    }

    return pkg;
  };

  private handleSubscription = async (
    donation: Donation,
    pkg: Package,
    language: LanguageCode
  ): Promise<readonly string[]> => {
    if (donation.quantity !== 1) {
      throw new Error("Subscriptions can only have 1 as quantity");
    }

    const tag = pkg.tags.find((t) => t.code === language) || pkg.defaultTag;

    const name = pkg.isCustom
      ? `${tag.name} (${pkg.price.amount}/${pkg.price.currency}/${pkg.recurrenceConfig.repeatInterval})`
      : tag.name;

    const product = await this.iyzicoService.createProduct({ name, description: tag.description }, language);
    const paymentPlan = await this.iyzicoService.createPaymentPlan(
      {
        name,
        price: pkg.price,
        productReferenceCode: product.referenceCode,
        recurrenceConfig: pkg.recurrenceConfig,
      },
      language
    );
    await this.iyzicoService.createCustomer({ email: donation.email, fullName: donation.fullName }, language);
    return this.iyzicoService.getFormContentsForSubscription(donation, paymentPlan.referenceCode, language);
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

    if (pkg.recurrenceConfig.repeatInterval !== RepeatInterval.None) {
      const formHtmlTags = await this.handleSubscription(donation, pkg, language);
      return {
        donation,
        formHtmlTags,
        package: pkg,
      };
    }

    const formHtmlTags = await this.iyzicoService.getFormContentsForSinglePayment(donation, pkg, language);
    return {
      donation,
      formHtmlTags,
      package: pkg,
    };
  };
}
