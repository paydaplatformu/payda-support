import axios from "axios";
import { createHmac } from "crypto";
import { format } from "date-fns";
import { inject, injectable } from "inversify";
import * as qs from "querystring";
import { config } from "../../config";
import { DonationService } from "../donation/DonationService";
import { PackageService } from "../package/PackageService";
import { PayuCredentials } from "../../models/PayuCredentials";
import { PayuService } from "./PayuService";
import { SubscriptionManagerService } from "../subscription-manager/SubscriptionManagerService";
import { SubscriptionService } from "../subscription/SubscriptionService";
import { TYPES } from "../../types";
import { getUTF8Length, isNonProduction, isProduction, splitName } from "../../utilities/helpers";
import {
  Donation,
  RepeatInterval,
  LanguageCode,
  SubscriptionStatus,
  DeactivationReason,
  PaymentProcess,
  Package,
  Subscription
} from "../../generated/graphql";

@injectable()
export class PayuServiceImpl implements PayuService {
  @inject(TYPES.DonationService)
  private donationService: DonationService = null as any;

  @inject(TYPES.PackageService)
  private packageService: PackageService = null as any;

  @inject(TYPES.SubscriptionService)
  private subscriptionService: SubscriptionService = null as any;

  @inject(TYPES.SubscriptionManagerService)
  private subscriptionManagerService: SubscriptionManagerService = null as any;

  private amexCredentials: PayuCredentials = {
    merchant: config.get("payu.amexCredentials.merchant"),
    secret: config.get("payu.amexCredentials.secret")
  };

  private recurringAmexCredentials: PayuCredentials = {
    merchant: config.get("payu.recurringAmexCredentials.merchant"),
    secret: config.get("payu.recurringAmexCredentials.secret")
  };

  private defaultCredentials: PayuCredentials = {
    merchant: config.get("payu.defaultCredentials.merchant"),
    secret: config.get("payu.defaultCredentials.secret")
  };

  private recurringDefaultCredentials: PayuCredentials = {
    merchant: config.get("payu.recurringDefaultCredentials.merchant"),
    secret: config.get("payu.recurringDefaultCredentials.secret")
  };

  private backRef: string = config.get("payu.backRef");

  private createHashInput = (donation: Donation, pkg: Package, language: LanguageCode, merchant: string): object => {
    const tag = pkg.tags.find(t => t.code === language) || pkg.defaultTag;
    const ref = this.getReference(false, pkg, donation);

    return {
      MERCHANT: merchant,
      ORDER_REF: ref || null,
      ORDER_DATE: format(donation.date, "yyyy-MM-dd HH:mm:ss"),
      "ORDER_PNAME[0]": tag.name,
      "ORDER_PCODE[0]": pkg.id,
      "ORDER_PINFO[0]": tag.description || "",
      "ORDER_PRICE[0]": pkg.price.amount,
      "ORDER_QTY[0]": donation.quantity.toString(),
      "ORDER_VAT[0]": "0",
      ORDER_SHIPPING: "",
      PRICES_CURRENCY: pkg.price.currency,
      PAY_METHOD: this.getPayMethod(pkg),
      "ORDER_PRICE_TYPE[0]": "GROSS",
      INSTALLMENT_OPTIONS: this.getInstallmentOptions(pkg)
    };
  };

  private finalizeFormFields = (
    input: object,
    donation: Donation,
    pkg: Package,
    language: LanguageCode,
    hash: string
  ) => {
    const { firstName, lastName } = splitName(donation.fullName);
    const tokenSettings: object =
      pkg.repeatInterval !== RepeatInterval.None
        ? {
            LU_ENABLE_TOKEN: "1"
          }
        : {};

    const finalObject = {
      ...input,
      BILL_FNAME: firstName,
      BILL_LNAME: lastName,
      BILL_EMAIL: donation.email,
      BILL_PHONE: "-",
      BILL_COUNTRYCODE: "TR",
      BACK_REF: this.backRef,
      LANGUAGE: language,
      ...tokenSettings,
      ORDER_HASH: hash
    };

    return Object.entries(finalObject).map(([key, value]) => ({
      key,
      value: value.toString()
    }));
  };

  private generateHashWithLength = (
    input: object,
    secret: string,
    shouldSort: boolean = false,
    hashAlgorithm: string = "md5"
  ) => {
    return new Promise<string>(resolve => {
      const keys = Object.keys(input);
      const sortHandled = shouldSort ? keys.sort() : keys;
      const toBeHashed = sortHandled
        .map(key => (input as any)[key])
        .map(value => {
          if (!value) return "0";
          if (Array.isArray(value)) return value.map(this.getResult).join();
          return this.getResult(value);
        })
        .join("");

      const hmac = createHmac(hashAlgorithm, secret);
      hmac.setEncoding("hex");
      hmac.end(toBeHashed, "utf8", () => {
        const hash = hmac.read();
        return resolve(hash.toString());
      });
    });
  };

  private generateSimpleHash = (
    input: object,
    secret: string,
    shouldSort: boolean = false,
    hashAlgorithm: string = "sha256"
  ) => {
    return new Promise<string>(resolve => {
      const keys = Object.keys(input);
      const sortHandled = shouldSort ? keys.sort() : keys;
      const toBeHashed = sortHandled
        .map(key => (input as any)[key])
        .map(value => {
          if (!value) return "";
          return value;
        })
        .join("");

      const hmac = createHmac(hashAlgorithm, secret);
      hmac.setEncoding("hex");
      hmac.end(toBeHashed, "utf8", () => {
        const hash = hmac.read();
        return resolve(hash.toString());
      });
    });
  };

  private getCredentials = (isAmex: boolean, useRecurringAccount: boolean) => {
    if (isAmex) {
      if (useRecurringAccount) {
        return this.recurringAmexCredentials;
      }
      return this.amexCredentials;
    }
    if (useRecurringAccount) {
      return this.recurringDefaultCredentials;
    }
    return this.defaultCredentials;
  };

  private getInstallmentOptions = (pkg: Package) =>
    pkg.repeatInterval !== RepeatInterval.None ? "1" : "1,2,3,4,5,6,7,8,9,10,11,12";

  private getPayMethod = (pkg: Package) => (pkg.repeatInterval !== RepeatInterval.None ? "CCVISAMC" : "");

  private getReference = (automated: boolean, pkg: Package, donation: Donation) => {
    const automatedString = automated ? "AUTO" : "FIRST_TIME";
    if (pkg.repeatInterval === RepeatInterval.TestB) {
      return `${automatedString}.${donation.id}.${format(new Date(), "yyyy-MM-dd-HH-mm")}`;
    } else if (pkg.repeatInterval === RepeatInterval.TestA) {
      return `${automatedString}.${donation.id}.${format(new Date(), "yyyy-MM-dd-HH")}`;
    } else if (pkg.repeatInterval === RepeatInterval.None) {
      return `${automatedString}.${donation.id}`;
    } else {
      return `${automatedString}.${donation.id}.${format(new Date(), "yyyy-MM")}`;
    }
  };

  private getResult = (value: any): string => getUTF8Length(value.toString()) + value.toString();

  public async getPaymentToken(isAmex: boolean, payuReferenceNumber: string): Promise<string> {
    const credentials = this.getCredentials(isAmex, true);
    const timestamp = Math.floor(Date.now() / 1000);

    const input = {
      merchant: credentials.merchant,
      refNo: payuReferenceNumber,
      timestamp
    };
    const hash = await this.generateSimpleHash(input, credentials.secret, false);
    const body = {
      ...input,
      signature: hash
    };
    const requestConfig = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    const response = await axios.post(config.get("payu.merchantTokenUrl"), qs.stringify(body), requestConfig);
    console.log(response.data);
    return response.data.response.token;
  }

  public chargeUsingToken = async (subscriptionId: string) => {
    const subscription = await this.subscriptionManagerService.getChargableSubscriptionById(subscriptionId);
    const paymentToken = await this.subscriptionService.getPaymentTokenById(subscriptionId);

    if (!subscription) throw new Error("Invalid input, no chargable subscription found.");
    if (!paymentToken) throw new Error("Invalid input, subscription cannot be charged.");

    const pkg = await this.packageService.getById(subscription.packageId);
    const donation = await this.donationService.getById(subscription.donationId);
    if (!pkg || !donation) throw new Error("Invalid subscription. No package or donation.");

    const credentials = this.getCredentials(donation.usingAmex, true);
    const ref = this.getReference(true, pkg, donation);
    const tag = pkg.tags.find(t => t.code === subscription.language) || pkg.defaultTag;
    const { firstName, lastName } = splitName(donation.fullName);

    const hashInput = {
      BILL_COUNTRYCODE: "TR",
      BILL_EMAIL: donation.email,
      BILL_FNAME: firstName,
      BILL_LNAME: lastName,
      BILL_PHONE: "-",
      CC_NUMBER: "",
      EXP_MONTH: "",
      EXP_YEAR: "",
      CC_CVV: "",
      CC_OWNER: "",
      CC_TOKEN: paymentToken,
      LANGUAGE: subscription.language,
      MERCHANT: credentials.merchant,
      ORDER_DATE: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      "ORDER_PCODE[0]": pkg.id,
      "ORDER_PINFO[0]": tag.description || "",
      "ORDER_PNAME[0]": tag.name,
      "ORDER_PRICE_TYPE[0]": "GROSS",
      "ORDER_PRICE[0]": pkg.price.amount,
      "ORDER_QTY[0]": donation.quantity.toString(),
      ORDER_REF: ref || null,
      ORDER_SHIPPING: "",
      "ORDER_VAT[0]": "0",
      PAY_METHOD: "CCVISAMC",
      PRICES_CURRENCY: pkg.price.currency
    };
    const hash = await this.generateHashWithLength(hashInput, credentials.secret, true);
    const body = {
      ...hashInput,
      ORDER_HASH: hash
    };
    const requestConfig = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };

    const response = isNonProduction()
      ? { data: "<STATUS>SUCCESS</STATUS>" }
      : await axios.post(config.get("payu.aluUrl"), qs.stringify(body), requestConfig);
    const result = response.data.match(/<STATUS>(\S+)<\/STATUS>/);

    const status = result && result.length && result.length === 2 && result[1] === "SUCCESS" ? true : false;

    const currentProcessHistory = subscription.processHistory;
    const lastProcess = {
      date: new Date(),
      isSuccess: status,
      result: {
        reason: "REGULAR_PAYMENT",
        payload: response.data
      }
    };

    await this.subscriptionService.edit(subscription.id, {
      processHistory: [...currentProcessHistory, lastProcess],
      paymentToken,
      deactivationReason: status ? null : DeactivationReason.Error,
      status: status ? SubscriptionStatus.Running : SubscriptionStatus.Cancelled
    });

    const childDonation = await this.donationService.create({
      email: donation.email,
      fullName: donation.fullName,
      parentDonationId: donation.id,
      customPriceAmount: null,
      customPriceCurrency: null,
      customRepeatInterval: null,
      notes: null,
      packageId: donation.packageId,
      quantity: donation.quantity,
      usingAmex: donation.usingAmex
    });

    await this.donationService.confirmPayment(childDonation.id);

    return {
      status,
      body: response.data || ""
    };
  };

  public getFormContents = async (donation: Donation, pkg: Package, language: LanguageCode) => {
    const credentials = this.getCredentials(donation.usingAmex, false);
    const hashInput = this.createHashInput(donation, pkg, language, credentials.merchant);
    const hash = await this.generateHashWithLength(hashInput, credentials.secret);
    return this.finalizeFormFields(hashInput, donation, pkg, language, hash);
  };

  private handleSubscriptionFirstPayment = async (donation: Donation, subscription: Subscription, data: any) => {
    const { REFNO: payuReferenceNumber, REFNOEXT: reference, TOKEN_HASH: paymentToken, ...restData } = data;

    const firstPaymentProcess: PaymentProcess = {
      date: new Date(),
      isSuccess: true,
      result: {
        reason: "FIRST_PAYMENT",
        payload: { ...restData, REFNOEXT: reference, REFNO: payuReferenceNumber }
      }
    };

    if (paymentToken) {
      await this.subscriptionService.edit(subscription.id, {
        processHistory: [firstPaymentProcess],
        paymentToken,
        status: SubscriptionStatus.Running,
        deactivationReason: null
      });
    } else {
      try {
        const paymentTokenFromReference = await this.getPaymentToken(donation.usingAmex, payuReferenceNumber);
        await this.subscriptionService.edit(subscription.id, {
          processHistory: [firstPaymentProcess],
          paymentToken: paymentTokenFromReference,
          status: SubscriptionStatus.Running,
          deactivationReason: null
        });
      } catch (error) {
        console.error(error?.response?.data?.error);
        await this.subscriptionService.edit(subscription.id, {
          processHistory: [
            {
              date: new Date(),
              isSuccess: false,
              result: {
                reason: "FIRST_PAYMENT",
                payload: { ...restData, REFNOEXT: reference, REFNO: payuReferenceNumber, error: error.message }
              }
            }
          ],
          paymentToken: null,
          status: SubscriptionStatus.Cancelled,
          deactivationReason: DeactivationReason.Error
        });
      }
    }
  };

  private respondToVerificationSuccess = async (donation: Donation, data: any, secret: string) => {
    const payuObject = {
      IPN_PID: data["IPN_PID[]"],
      IPN_PNAME: data["IPN_PNAME[]"],
      IPN_DATE: data.IPN_DATE,
      DATE: format(new Date(), "yyyyMMddHHmmss")
    };

    const returnHashAuto = await this.generateHashWithLength(payuObject, secret);
    return {
      donationId: donation.id,
      returnHash: "<epayment>" + payuObject.DATE + "|" + returnHashAuto + "</epayment>"
    };
  };

  public verifyNotification = async (input: any) => {
    console.log(input);
    const { HASH: hash, ...data } = input;
    const { REFNOEXT: reference } = data;
    const [mode, donationId] = reference.split(".");

    const donation = await this.donationService.getById(donationId);
    if (!donation) throw new Error("Donation id not found.");

    const credentials = this.getCredentials(donation.usingAmex, false);

    if (isProduction()) {
      const hashCalculated = await this.generateHashWithLength(data, credentials.secret);
      if (hashCalculated !== hash) throw new Error("Incorrect hash given.");
    }

    if (mode === "AUTO") {
      return this.respondToVerificationSuccess(donation, data, credentials.secret);
    }

    const subscription = await this.subscriptionService.getByDonationId(donationId);
    if (subscription) {
      await this.handleSubscriptionFirstPayment(donation, subscription, data);
    }

    return this.respondToVerificationSuccess(donation, data, credentials.secret);
  };
}
