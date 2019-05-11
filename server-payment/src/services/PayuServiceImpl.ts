import axios from "axios";
import { createHmac } from "crypto";
import { format, startOfMonth } from "date-fns";
import { inject, injectable } from "inversify";
import * as qs from "querystring";
import { config } from "../config";
import { DeactivationReason } from "../models/DeactivationReason";
import { DonationModel } from "../models/Donation";
import { DonationService } from "../models/DonationService";
import { LanguageCode } from "../models/LanguageCode";
import { PackageModel } from "../models/Package";
import { PackageService } from "../models/PackageService";
import { PaymentProcess } from "../models/PaymentProcess";
import { PayuCredentials } from "../models/PayuCredentials";
import { PayuService } from "../models/PayuService";
import { RepeatInterval } from "../models/RepeatInterval";
import { SubscriptionService } from "../models/SubscriptionService";
import { SubscriptionStatus } from "../models/SubscriptionStatus";
import { TYPES } from "../types";
import { getUTF8Length, splitName } from "../utilities/helpers";
import { SubscriptionManagerService } from "../models/SubscriptionManagerService";

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
  private backRef: string = config.get("payu.backRef");

  private createHashInput = (
    donation: DonationModel,
    pkg: PackageModel,
    language: LanguageCode,
    merchant: string
  ): object => {
    const tag = pkg.tags.find(t => t.code === language) || pkg.defaultTag;
    const ref = this.getReference(pkg, donation);

    return {
      MERCHANT: merchant,
      ORDER_REF: ref || null,
      ORDER_DATE: format(donation.date, "YYYY-MM-DD HH:mm:ss"),
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

  private defaultCredentials: PayuCredentials = {
    merchant: config.get("payu.defaultCredentials.merchant"),
    secret: config.get("payu.defaultCredentials.secret")
  };

  private finalizeFormFields = (
    input: object,
    donation: DonationModel,
    pkg: PackageModel,
    language: LanguageCode,
    hash: string
  ) => {
    const { firstName, lastName } = splitName(donation.fullName);
    const tokenSettings: object =
      pkg.repeatInterval !== RepeatInterval.NONE
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

  private generateHash = (input: object, secret: string, shouldSort: boolean = false) => {
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

      const hmac = createHmac("md5", secret);
      hmac.setEncoding("hex");
      hmac.end(toBeHashed, "utf8", () => {
        const hash = hmac.read();
        return resolve(hash.toString());
      });
    });
  };

  private getCredentials = (isAmex: boolean) => {
    if (isAmex) return this.amexCredentials;
    return this.defaultCredentials;
  };

  private getInstallmentOptions = (pkg: PackageModel) =>
    pkg.repeatInterval !== RepeatInterval.NONE ? "1" : "1,2,3,4,5,6,7,8,9,10,11,12";

  private getPayMethod = (pkg: PackageModel) => (pkg.repeatInterval !== RepeatInterval.NONE ? "CCVISAMC" : "");

  private getReference = (pkg: PackageModel, donation: DonationModel) =>
    pkg.repeatInterval !== RepeatInterval.NONE ? `${donation.id}.${format(new Date(), "YYYY-MM")}` : donation.id;

  private getResult = (value: any): string => getUTF8Length(value.toString()) + value.toString();

  public chargeUsingToken = async (subscriptionId: string) => {
    const subscription = await this.subscriptionManagerService.getChargableSubscriptionById(subscriptionId);
    const paymentToken = await this.subscriptionService.getPaymentTokenById(subscriptionId);

    if (!subscription) throw new Error("Invalid input, no chargable subscription found.");
    if (!paymentToken) throw new Error("Invalid input, subscription cannot be charged.");

    const pkg = await this.packageService.getById(subscription.packageId);
    const donation = await this.donationService.getById(subscription.donationId);
    if (!pkg || !donation) throw new Error("Invalid subscription. No package or donation.");

    const credentials = this.getCredentials(donation.usingAmex);
    const ref = this.getReference(pkg, donation);
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
      ORDER_DATE: format(new Date(), "YYYY-MM-DD HH:mm:ss"),
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
    const hash = await this.generateHash(hashInput, credentials.secret, true);
    const body = {
      ...hashInput,
      ORDER_HASH: hash
    };
    const requestConfig = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };

    // TODO: revert
    // const response = await axios.post(config.get("payu.aluUrl"), qs.stringify(body), requestConfig);
    const response = { data: "<STATUS>SUCCESS</STATUS>" };
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

    await this.subscriptionService.edit({
      id: subscription.id,
      processHistory: [...currentProcessHistory, lastProcess],
      paymentToken,
      deactivationReason: status ? null : DeactivationReason.ERROR,
      status: status ? SubscriptionStatus.RUNNING : SubscriptionStatus.CANCELLED
    });

    const childDonation = await this.donationService.create({
      email: donation.email,
      fullName: donation.fullName,
      parentDonationId: donation.id,
      customPriceAmount: undefined,
      customPriceCurrency: undefined,
      customRepeatInterval: undefined,
      notes: undefined,
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

  public getFormContents = async (donation: DonationModel, pkg: PackageModel, language: LanguageCode) => {
    const credentials = this.getCredentials(donation.usingAmex);
    const hashInput = this.createHashInput(donation, pkg, language, credentials.merchant);
    const hash = await this.generateHash(hashInput, credentials.secret);
    return this.finalizeFormFields(hashInput, donation, pkg, language, hash);
  };

  public verifyNotification = async (input: any) => {
    const { HASH: hash, ...data } = input;
    const { REFNOEXT: reference, TOKEN_HASH: paymentToken, ...restData } = data;

    const [donationId] = reference.split(".");

    const donation = await this.donationService.getById(donationId);
    if (!donation) throw new Error("Donation id not found.");

    if (paymentToken) {
      const subscription = await this.subscriptionService.getByDonationId(donationId);
      if (!subscription) throw new Error("Subscription not found.");
      const lastProcess: PaymentProcess = {
        date: new Date(),
        isSuccess: true,
        result: {
          reason: "FIRST_PAYMENT",
          payload: { ...restData, REFNOEXT: reference }
        }
      };
      await this.subscriptionService.edit({
        id: subscription.id,
        processHistory: [lastProcess],
        paymentToken,
        status: SubscriptionStatus.RUNNING
      });
    }

    const credentials = this.getCredentials(donation.usingAmex);

    const payu = {
      IPN_PID: data["IPN_PID[]"],
      IPN_PNAME: data["IPN_PNAME[]"],
      IPN_DATE: data.IPN_DATE,
      DATE: format(new Date(), "YYYYMMDDHHmmss")
    };

    const hashCalculated = await this.generateHash(data, credentials.secret);

    // TODO: revert
    // if (hashCalculated !== hash) throw new Error("Incorrect hash given.");

    const returnHash = await this.generateHash(payu, credentials.secret);
    return {
      donationId: donation.id,
      returnHash: "<epayment>" + payu.DATE + "|" + returnHash + "</epayment>"
    };
  };
}
