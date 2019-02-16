import axios from "axios";
import { createHmac } from "crypto";
import { format, startOfMonth } from "date-fns";
import { inject, injectable } from "inversify";
import * as qs from "querystring";
import { config } from "../config";
import { IDonation } from "../models/Donation";
import { IDonationService } from "../models/DonationService";
import { LanguageCode } from "../models/LanguageCode";
import { IPackage } from "../models/Package";
import { IPackageService } from "../models/PackageService";
import { PaymentProcess } from "../models/PaymentProcess";
import { PayuCredentials } from "../models/PayuCredentials";
import { IPayuService } from "../models/PayuService";
import { RepeatConfig } from "../models/RepeatConfig";
import { ISubscriptionService } from "../models/SubscriptionService";
import { SubscriptionStatus } from "../models/SubscriptionStatus";
import { TYPES } from "../types";
import { getUTF8Length, splitName } from "../utilities/helpers";

@injectable()
export class PayuService implements IPayuService {
  @inject(TYPES.IPackageService)
  private packageService: IPackageService = null as any;

  @inject(TYPES.IDonationService)
  private donationService: IDonationService = null as any;

  @inject(TYPES.ISubscriptionService)
  private subscriptionService: ISubscriptionService = null as any;

  private defaultCredentials: PayuCredentials = {
    merchant: config.get("payu.defaultCredentials.merchant"),
    secret: config.get("payu.defaultCredentials.secret")
  };

  private amexCredentials: PayuCredentials = {
    merchant: config.get("payu.amexCredentials.merchant"),
    secret: config.get("payu.amexCredentials.secret")
  };

  private backRef: string = config.get("payu.backRef");

  private getCredentials(isAmex: boolean) {
    if (isAmex) return this.amexCredentials;
    return this.defaultCredentials;
  }

  public async chargeUsingToken(subscriptionId: string) {
    const subscription = await this.subscriptionService.getEntityById(subscriptionId);

    if (!subscription) throw new Error("Invalid input, no subscription found.");
    if (!subscription.paymentToken) throw new Error("Invalid input, subscription cannot be charged.");

    const pkg = await this.packageService.getById(subscription.packageId.toString());
    const donation = await this.donationService.getById(subscription.donationId.toString());
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
      CC_TOKEN: subscription.paymentToken,
      LANGUAGE: subscription.language,
      MERCHANT: credentials.merchant,
      ORDER_DATE: format(donation.date, "YYYY-MM-DD HH:MM:SS"),
      "ORDER_PCODE[0]": pkg.id,
      "ORDER_PINFO[0]": tag.description || "",
      "ORDER_PNAME[0]": tag.name,
      "ORDER_PRICE_TYPE[0]": "GROSS",
      "ORDER_PRICE[0]": pkg.price.amount,
      "ORDER_QTY[0]": donation.quantity.toString(),
      ORDER_REF: ref,
      ORDER_SHIPPING: "",
      "ORDER_VAT[0]": "0",
      PAY_METHOD: "",
      PRICES_CURRENCY: pkg.price.currency
    };
    const hash = await this.generateHash(hashInput, credentials.secret);
    const body = {
      ...hashInput,
      ORDER_HASH: hash
    };
    const requestConfig = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };

    const response = await axios.post(config.get("payu.aluUrl"), qs.stringify(body), requestConfig);
    console.log(response.data); // tslint:disable-line
    const result = response.data.match(/<STATUS>(\S+)<\/STATUS>/);

    const status = !result || !result.length || result.length !== 2;

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
      id: subscription._id.toString(),
      processHistory: [...currentProcessHistory, lastProcess],
      paymentToken: subscription.paymentToken,
      deactivationReason: null,
      status: SubscriptionStatus.RUNNING
    });

    return {
      status,
      body: response.data || ""
    };
  }

  public async verifyNotification(input: any) {
    const { HASH: hash, ...data } = input;
    const { REFNOEXT: reference, TOKEN_HASH: paymentToken } = data;

    const [donationId] = reference.split(".");

    const donation = await this.donationService.getById(donationId);
    if (!donation) throw new Error("Donation id not found.");

    if (paymentToken) {
      const subscription = await this.subscriptionService.getByDonationId(donationId);
      if (!subscription) throw new Error("Subscription not found.");
      const lastProcess: PaymentProcess = {
        date: startOfMonth(new Date()),
        isSuccess: true,
        result: {
          reason: "FIRST_PAYMENT",
          payload: null
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

    if (hashCalculated !== hash) throw new Error("Incorrect hash given.");

    const returnHash = await this.generateHash(payu, credentials.secret);
    return {
      donationId: donation.id,
      returnHash: "<epayment>" + payu.DATE + "|" + returnHash + "</epayment>"
    };
  }

  public async getFormContents(donation: IDonation, pkg: IPackage, language: LanguageCode) {
    const credentials = this.getCredentials(donation.usingAmex);
    const hashInput = this.createHashInput(donation, pkg, language, credentials.merchant);
    const hash = await this.generateHash(hashInput, credentials.secret);
    return this.finalizeFormFields(hashInput, donation, pkg, language, hash);
  }

  private createHashInput(donation: IDonation, pkg: IPackage, language: LanguageCode, merchant: string): object {
    const tag = pkg.tags.find(t => t.code === language) || pkg.defaultTag;
    const ref = this.getReference(pkg, donation);

    return {
      MERCHANT: merchant,
      ORDER_REF: ref,
      ORDER_DATE: format(donation.date, "YYYY-MM-DD HH:MM:SS"),
      "ORDER_PNAME[0]": tag.name,
      "ORDER_PCODE[0]": pkg.id,
      "ORDER_PINFO[0]": tag.description || "",
      "ORDER_PRICE[0]": pkg.price.amount,
      "ORDER_QTY[0]": donation.quantity.toString(),
      "ORDER_VAT[0]": "0",
      ORDER_SHIPPING: "",
      PRICES_CURRENCY: pkg.price.currency,
      PAY_METHOD: "",
      "ORDER_PRICE_TYPE[0]": "GROSS",
      INSTALLMENT_OPTIONS: "1,2,3,4,5,6,7,8,9,10,11,12"
    };
  }

  private getReference = (pkg: IPackage, donation: IDonation) =>
    pkg.repeatConfig !== RepeatConfig.NONE ? `${donation.id}.${format(new Date(), "YYYY-MM")}` : donation.id;

  private getResult = (value: any): string => getUTF8Length(value.toString()) + value.toString();

  private generateHash = (input: object, secret: string) => {
    return new Promise<string>(resolve => {
      const toBeHashed = Object.values(input)
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

  private finalizeFormFields = (
    input: object,
    donation: IDonation,
    pkg: IPackage,
    language: LanguageCode,
    hash: string
  ) => {
    const { firstName, lastName } = splitName(donation.fullName);
    const tokenSettings: object =
      pkg.repeatConfig !== RepeatConfig.NONE
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
}
