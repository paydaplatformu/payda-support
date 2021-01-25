import { throws } from "assert";
import { inject, injectable } from "inversify";
import { Donation, DonationCreationResult, LanguageCode, Package, RepeatInterval } from "../../generated/graphql";
import { DonationCreator } from "../../models/Donation";
import { ValidationError } from "../../models/Errors";
import { TYPES } from "../../types";
import { DonationService } from "../donation/DonationService";
import {
  CreateIyzicoCustomer,
  CreateIyzicoPaymentPlan,
  CreateIyzicoProduct,
  IyzicoProduct,
  IyzicoService,
} from "../iyzico/IyzicoService";
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

  private getOrCreateProduct = async (input: CreateIyzicoProduct, language: LanguageCode) => {
    const products = await this.iyzicoService.getAllProducts(language);

    let product = products.find((product) => product.name === input.name);

    if (!product) {
      try {
        product = await this.iyzicoService.createProduct(input, language);
      } catch {
        // In case of race condition
        const products = await this.iyzicoService.getAllProducts(language);
        product = products.find((product) => product.name === input.name);
      }
    }

    if (!product) {
      throw new Error("Could not create product");
    }

    return product;
  };

  private getOrCreateCustomer = async (input: CreateIyzicoCustomer, language: LanguageCode) => {
    const customers = await this.iyzicoService.getAllCustomers(language);

    let customer = customers.find((customer) => customer.email === input.email);

    if (!customer) {
      try {
        customer = await this.iyzicoService.createCustomer(input, language);
      } catch (error) {
        console.log({ error });
        if (error instanceof ValidationError) throw error;

        // In case of race condition
        const customers = await this.iyzicoService.getAllCustomers(language);
        customer = customers.find((customer) => customer.email === input.email);
      }
    }

    if (!customer) {
      throw new Error("Could not create customer");
    }

    return customer;
  };

  private getOrCreatePaymentPlan = async (
    input: CreateIyzicoPaymentPlan,
    product: IyzicoProduct,
    language: LanguageCode
  ): Promise<string> => {
    const existing = product.pricingPlans.find((plan) => plan.status === "ACTIVE");
    if (existing) {
      return existing.referenceCode;
    }
    try {
      const paymentPlan = await this.iyzicoService.createPaymentPlan(input, language);
      return paymentPlan.referenceCode;
    } catch {
      const newProduct = await this.iyzicoService.getProduct(product.referenceCode);

      if (!newProduct) {
        throw new Error("Product not found");
      }

      const existing = newProduct.pricingPlans.find((plan) => plan.status === "ACTIVE");
      if (existing) {
        return existing.referenceCode;
      }
    }
    throw new Error("Could not create payment plan");
  };

  private handleSubscription = async (
    donation: Donation,
    pkg: Package,
    language: LanguageCode
  ): Promise<readonly string[]> => {
    console.log("handleSubscription", { donation, pkg });

    if (donation.quantity !== 1) {
      throw new Error("Subscriptions can only have 1 as quantity");
    }

    const tag = pkg.tags.find((t) => t.code === language) || pkg.defaultTag;

    const name = pkg.isCustom
      ? `${tag.name} (${pkg.price.amount}/${pkg.price.currency}/${pkg.recurrenceConfig.repeatInterval})`
      : tag.name;

    const product = await this.getOrCreateProduct({ name, description: tag.description }, language);

    console.log("handleSubscription", { donation, pkg, product });

    const paymentPlanReferenceCode = await this.getOrCreatePaymentPlan(
      {
        name,
        price: pkg.price,
        productReferenceCode: product.referenceCode,
        recurrenceConfig: pkg.recurrenceConfig,
      },
      product,
      language
    );

    console.log("handleSubscription", { donation, pkg, product, paymentPlanReferenceCode });

    await this.getOrCreateCustomer(
      { email: donation.email, phoneNumber: donation.phoneNumber, fullName: donation.fullName },
      language
    );

    console.log("handleSubscriptionAfterCustomer", { donation, pkg, product, paymentPlanReferenceCode });

    return this.iyzicoService.getFormContentsForSubscription(donation, paymentPlanReferenceCode, language);
  };

  public createDonation = async (
    donationCreator: DonationCreator,
    language: LanguageCode
  ): Promise<DonationCreationResult> => {
    console.log("createDonation", { donationCreator });

    const pkg = await this.getPackageForDonationCreator(donationCreator);

    console.log("createDonation", { donationCreator, pkg });
    const donation = await this.donationService.create({
      ...donationCreator,
      packageId: pkg.id,
    });

    console.log("createDonation", { donationCreator, pkg, donation });

    if (pkg.recurrenceConfig.repeatInterval !== RepeatInterval.None) {
      const formHtmlTags = await this.handleSubscription(donation, pkg, language);
      console.log("createDonationSub", { donationCreator, pkg, donation, formHtmlTags });

      return {
        donation,
        formHtmlTags,
        package: pkg,
      };
    }

    const formHtmlTags = await this.iyzicoService.getFormContentsForSinglePayment(donation, pkg, language);
    console.log("createDonationSingle", { donationCreator, pkg, donation, formHtmlTags });

    return {
      donation,
      formHtmlTags,
      package: pkg,
    };
  };
}
