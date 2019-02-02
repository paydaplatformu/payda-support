import { createHmac } from "crypto";
import { format, startOfMonth } from "date-fns";
import { inject, injectable } from "inversify";
import { config } from "../config";
import { IDonation } from "../models/Donation";
import { IDonationService } from "../models/DonationService";
import { LanguageCode } from "../models/LanguageCode";
import { LastProcess } from "../models/LastProcess";
import { IPackage } from "../models/Package";
import { PayuCredentials } from "../models/PayuCredentials";
import { IPayuService } from "../models/PayuService";
import { RepeatConfig } from "../models/RepeatConfig";
import { ISubscriptionService } from "../models/SubscriptionService";
import { TYPES } from "../types";
import { getUTF8Length } from "../utilities/helpers";

@injectable()
export class PayuService implements IPayuService {
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

  public async verifyNotification(input: any) {
    console.log(JSON.stringify(input, null, 2)); // tslint:disable-line
    const { HASH: hash, ...data } = input;
    const { REFNOEXT: donationId, TOKEN_HASH: paymentToken } = data;

    const donation = await this.donationService.getById(donationId);
    if (!donation) throw new Error("Donation id not found.");

    if (paymentToken) {
      const subscription = await this.subscriptionService.getByDonationId(donationId);
      if (!subscription) throw new Error("Subscription not found.");
      const lastProcess: LastProcess = {
        date: startOfMonth(new Date()),
        isSuccess: true,
        result: {
          reason: "FIRST_PAYMENT",
          payload: null
        }
      };
      await this.subscriptionService.edit({ id: subscription.id, lastProcess, paymentToken });
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
    return {
      MERCHANT: merchant,
      ORDER_REF: donation.id,
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
    const splitted = donation.fullName.split(" ");
    const firstName = splitted.slice(0, -1).join(" ");
    const lastName = splitted.slice(-1).join(" ");

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
