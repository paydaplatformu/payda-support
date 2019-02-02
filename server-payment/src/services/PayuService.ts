import { createHmac } from "crypto";
import { format } from "date-fns";
import { inject, injectable } from "inversify";
import { config } from "../config";
import { IDonation } from "../models/Donation";
import { IDonationService } from "../models/DonationService";
import { LanguageCode } from "../models/LanguageCode";
import { IPackage } from "../models/Package";
import { PayuCredentials } from "../models/PayuCredentials";
import { IPayuService } from "../models/PayuService";
import { TYPES } from "../types";
import { getUTF8Length } from "../utilities/helpers";

@injectable()
export class PayuService implements IPayuService {
  @inject(TYPES.IDonationService)
  private donationService: IDonationService = null as any;

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
    const { HASH: hash, ...data } = input;
    const { REFNOEXT: donationId, IPN_PID, IPN_DATE, IPN_PNAME } = data;

    const donation = await this.donationService.getById(donationId);
    if (!donation) throw new Error("Donation id not found.");
    const credentials = this.getCredentials(donation.usingAmex);

    const payu = {
      IPN_PID: IPN_PID[0],
      IPN_PNAME: IPN_PNAME[0],
      IPN_DATE,
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
    return this.finalizeFormFields(hashInput, donation, language, hash);
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

  private finalizeFormFields = (input: object, donation: IDonation, language: LanguageCode, hash: string) => {
    const splitted = donation.fullName.split(" ");
    const firstName = splitted.slice(0, -1).join(" ");
    const lastName = splitted.slice(-1).join(" ");

    const finalObject = {
      ...input,
      BILL_FNAME: firstName,
      BILL_LNAME: lastName,
      BILL_EMAIL: donation.email,
      BILL_PHONE: "-",
      BILL_COUNTRYCODE: "TR",
      BACK_REF: this.backRef,
      LANGUAGE: language,
      LU_ENABLE_TOKEN: "1",
      ORDER_HASH: hash
    };

    return Object.entries(finalObject).map(([key, value]) => ({
      key,
      value: value.toString()
    }));
  };
}
