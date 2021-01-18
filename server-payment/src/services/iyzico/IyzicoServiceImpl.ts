import { format } from "date-fns";
import { injectable } from "inversify";
import { config } from "../../config";
import { Donation, LanguageCode, MonetaryAmount, Package, RepeatInterval } from "../../generated/graphql";
import { splitName } from "../../utilities/helpers";
import {
  CreateIyzicoCustomer,
  CreateIyzicoPaymentPlan,
  CreateIyzicoProduct,
  IyzicoCustomer,
  IyzicoPaymentPlan,
  IyzicoPaymentResult,
  IyzicoProduct,
  IyzicoService,
} from "./IyzicoService";
import * as crypto from "crypto";
import { promisify } from "util";
import { range } from "lodash";

const Iyzipay = require("iyzipay");

@injectable()
export class IyzicoServiceImpl implements IyzicoService {
  private secretKey = config.get("iyzico.secretKey");

  private client = new Iyzipay({
    apiKey: config.get("iyzico.apiKey"),
    secretKey: this.secretKey,
    uri: config.get("iyzico.baseUrl"),
  });

  private callbackUrl: string = config.get("iyzico.callbackUrl");

  private getCurrency = (price: MonetaryAmount) =>
    price.currency === "USD" ? Iyzipay.CURRENCY.USD : Iyzipay.CURRENCY.TRY;
  private getLocale = (language: LanguageCode) => (language === "EN" ? Iyzipay.LOCALE.EN : Iyzipay.LOCALE.TR);
  private getInterval = (interval: RepeatInterval): string | null => {
    if (interval === RepeatInterval.Daily) {
      return Iyzipay.SUBSCRIPTION_PRICING_PLAN_INTERVAL.DAILY;
    } else if (interval === RepeatInterval.Weekly) {
      return Iyzipay.SUBSCRIPTION_PRICING_PLAN_INTERVAL.WEEKLY;
    } else if (interval === RepeatInterval.Monthly) {
      return Iyzipay.SUBSCRIPTION_PRICING_PLAN_INTERVAL.MONTHLY;
    } else if (interval === RepeatInterval.Yearly) {
      return Iyzipay.SUBSCRIPTION_PRICING_PLAN_INTERVAL.YEARLY;
    } else if (interval === RepeatInterval.None) {
      return null;
    } else {
      throw new Error("Unknown interval");
    }
  };

  public chargeUsingToken = () => {
    throw new Error("not implemented");
  };

  public getWebhookSignature = (iyziEventType: string, token: string): string => {
    const toHash = `${this.secretKey}${iyziEventType}${token}`;
    return crypto.createHash("sha1").update(toHash).digest("base64");
  };

  public retrievePaymentResult = (token: string) => {
    return promisify(this.client.checkoutForm.retrieve).call(this.client.checkoutForm, { token });
  };

  public extractDonationIdFromReference = (reference: string): string => {
    const [_, donationId] = reference.split(".");
    return donationId;
  };

  public getFormContentsForSinglePayment = async (
    donation: Donation,
    pkg: Package,
    language: LanguageCode
  ): Promise<string[]> => {
    const { firstName, lastName } = splitName(donation.fullName);
    const tag = pkg.tags.find((t) => t.code === language) || pkg.defaultTag;

    const basketItems = range(donation.quantity).map((i) => ({
      id: `${donation.id}-${i}`,
      name: `${tag.name} ${i + 1}`,
      category1: "Payda",
      itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
      price: pkg.price.amount.toString(),
    }));

    const data = {
      locale: this.getLocale(language),
      price: pkg.price.amount.toString(),
      paidPrice: pkg.price.amount.toString(),
      currency: this.getCurrency(pkg.price),
      basketId: donation.id,
      enabledInstallments: [2, 3, 6, 9],
      callbackUrl: this.callbackUrl,
      buyer: {
        id: donation.email,
        name: firstName,
        surname: lastName,
        identityNumber: "1111111110",
        city: "Istanbul",
        country: "Turkey",
        email: donation.email,
        ip: donation.ip,
        registrationAddress: "not available",
      },
      billingAddress: {
        contactName: donation.fullName,
        city: "Istanbul",
        country: "Turkey",
        address: "not available",
      },
      basketItems,
    };

    const result = await promisify(this.client.checkoutFormInitialize.create).call(
      this.client.checkoutFormInitialize,
      data
    );
    console.log(result);
    if (!result.checkoutFormContent) {
      return [];
    }
    const value = [result.checkoutFormContent as string, '<div id="iyzipay-checkout-form" class="responsive"></div>'];
    console.log(value);
    return value;
  };

  public getFormContentsForSubscription = async (
    donation: Donation,
    pricingPlanReferenceCode: string,
    language: LanguageCode
  ) => {
    const { firstName, lastName } = splitName(donation.fullName);

    const data = {
      locale: this.getLocale(language),
      callbackUrl: this.callbackUrl,
      pricingPlanReferenceCode,
      subscriptionInitialStatus: Iyzipay.SUBSCRIPTION_INITIAL_STATUS.ACTIVE,
      customer: {
        name: firstName,
        surname: lastName,
        identityNumber: "1111111110",
        email: donation.email,
        gsmNumber: "+9005555555555",
        billingAddress: {
          contactName: donation.fullName,
          city: "Istanbul",
          country: "Turkey",
          address: "not available",
        },
        shippingAddress: {
          contactName: donation.fullName,
          city: "Istanbul",
          country: "Turkey",
          address: "not available",
        },
      },
    };

    console.log(data);

    const result = await promisify(this.client.subscriptionCheckoutForm.initialize).call(
      this.client.subscriptionCheckoutForm,
      data
    );
    console.log(result);
    if (!result.checkoutFormContent) {
      return [];
    }
    const value = [result.checkoutFormContent as string, '<div id="iyzipay-checkout-form" class="responsive"></div>'];
    console.log(value);
    return value;
  };

  public getAllProducts = async (language: LanguageCode) => {
    const doRequest = async (accumulated: IyzicoProduct[] = [], currentPage: number = 1): Promise<IyzicoProduct[]> => {
      const result = await promisify(this.client.subscriptionProduct.retrieveList).call(
        this.client.subscriptionProduct,
        {
          locale: this.getLocale(language),
          page: currentPage,
          count: 100,
        }
      );
      if (result.status !== "success") {
        console.error(result);
        throw new Error(result.errorMessage || "Iyzico error");
      }
      if (result.data.pageCount === result.data.currentPage) {
        return accumulated.concat(result.data.items);
      }
      return doRequest(accumulated.concat(result.data.items), result.data.currentPage + 1);
    };

    return doRequest();
  };

  public getAllCustomers = async (language: LanguageCode) => {
    const doRequest = async (
      accumulated: IyzicoCustomer[] = [],
      currentPage: number = 1
    ): Promise<IyzicoCustomer[]> => {
      const result = await promisify(this.client.subscriptionCustomer.retrieveList).call(
        this.client.subscriptionCustomer,
        {
          locale: this.getLocale(language),
          page: currentPage,
          count: 100,
        }
      );
      if (result.status !== "success") {
        console.error(result);
        throw new Error(result.errorMessage || "Iyzico error");
      }
      if (result.data.pageCount === result.data.currentPage) {
        return accumulated.concat(result.data.items);
      }
      return doRequest(accumulated.concat(result.data.items), result.data.currentPage + 1);
    };

    return doRequest();
  };

  public getProduct = async (productReferenceCode: string) => {
    const result = await promisify(this.client.subscriptionProduct.retrieve).call(this.client.subscriptionProduct, {
      productReferenceCode,
    });
    if (result.status !== "success") {
      console.error(result);
      throw new Error(result.errorMessage || "Iyzico error");
    }
    return result.data;
  };

  public createProduct = async (input: CreateIyzicoProduct, language: LanguageCode): Promise<IyzicoProduct> => {
    const result = await promisify(this.client.subscriptionProduct.create).call(this.client.subscriptionProduct, {
      locale: this.getLocale(language),
      ...input,
    });
    if (result.status !== "success") {
      console.error(result);
      throw new Error(result.errorMessage || "Iyzico error");
    }
    return result.data;
  };

  public createPaymentPlan = async (
    input: CreateIyzicoPaymentPlan,
    language: LanguageCode
  ): Promise<IyzicoPaymentPlan> => {
    const paymentInterval = this.getInterval(input.recurrenceConfig.repeatInterval);
    if (!paymentInterval) {
      throw new Error("Cannot create payment plan for single pay donations");
    }

    const result = await promisify(this.client.subscriptionPricingPlan.create).call(
      this.client.subscriptionPricingPlan,
      {
        locale: this.getLocale(language),
        productReferenceCode: input.productReferenceCode,
        name: input.name,
        price: input.price.amount,
        currencyCode: this.getCurrency(input.price),
        paymentInterval,
        paymentIntervalCount: 1,
        planPaymentType: Iyzipay.PLAN_PAYMENT_TYPE.RECURRING,
        recurrenceCount: input.recurrenceConfig.count,
      }
    );
    if (result.status !== "success") {
      console.error(result);
      throw new Error(result.errorMessage || "Iyzico error");
    }
    return result.data;
  };

  public createCustomer = async (input: CreateIyzicoCustomer, language: LanguageCode): Promise<IyzicoCustomer> => {
    const { firstName, lastName } = splitName(input.fullName);

    const result = await promisify(this.client.subscriptionCustomer.create).call(this.client.subscriptionCustomer, {
      locale: this.getLocale(language),
      name: firstName,
      surname: lastName,
      identityNumber: "1111111110",
      email: input.email,
      gsmNumber: "+9005555555555",
      billingAddress: {
        contactName: input.fullName,
        city: "Istanbul",
        country: "Turkey",
        address: "not available",
      },
      shippingAddress: {
        contactName: input.fullName,
        city: "Istanbul",
        country: "Turkey",
        address: "not available",
      },
    });

    if (result.status !== "success") {
      console.error(result);
      throw new Error(result.errorMessage || "Iyzico error");
    }
    return result.data;
  };
}
