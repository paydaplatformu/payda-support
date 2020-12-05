import { format } from "date-fns";
import { injectable } from "inversify";
import { config } from "../../config";
import { Donation, LanguageCode, Package, RepeatInterval } from "../../generated/graphql";
import { splitName } from "../../utilities/helpers";
import { IyzicoPaymentResult, IyzicoService } from "./IyzicoService";
import * as crypto from "crypto";
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

  private getInstallmentOptions = (pkg: Package) => (pkg.repeatInterval !== RepeatInterval.None ? [] : [2, 3, 6, 9]);

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

  private getCurrency = (pkg: Package) => (pkg.price.currency === "USD" ? Iyzipay.CURRENCY.USD : Iyzipay.CURRENCY.TRY);
  private getLocale = (language: LanguageCode) => (language === "EN" ? Iyzipay.LOCALE.EN : Iyzipay.LOCALE.TR);

  public chargeUsingToken = () => {
    throw new Error("not implemented");
  };

  public getWebhookSignature = (iyziEventType: string, token: string): string => {
    const toHash = `${this.secretKey}${iyziEventType}${token}`;
    return crypto.createHash("sha1").update(toHash).digest("base64");
  };

  public retrievePaymentResult = (token: string) => {
    return new Promise<IyzicoPaymentResult>((resolve, reject) => {
      this.client.checkoutForm.retrieve(
        {
          token,
        },
        (error: any, result: IyzicoPaymentResult) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
  };

  public extractDonationIdFromReference = (reference: string): string => {
    const [_, donationId] = reference.split(".");
    return donationId;
  };

  public getFormContents = (donation: Donation, pkg: Package, language: LanguageCode): Promise<string[]> => {
    const { firstName, lastName } = splitName(donation.fullName);
    const tag = pkg.tags.find((t) => t.code === language) || pkg.defaultTag;

    const data = {
      locale: this.getLocale(language),
      price: pkg.price.amount.toString(),
      paidPrice: pkg.price.amount.toString(),
      currency: this.getCurrency(pkg),
      basketId: this.getReference(false, pkg, donation),
      enabledInstallments: this.getInstallmentOptions(pkg),
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
      basketItems: [
        {
          id: donation.id,
          name: tag.name,
          category1: "Payda",
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: pkg.price.amount.toString(),
        },
      ],
    };

    return new Promise((resolve, reject) => {
      this.client.checkoutFormInitialize.create(data, (error: any, result: any) => {
        if (error) {
          return reject(error);
        }
        if (!result.checkoutFormContent) {
          return [];
        }
        console.log(result);
        console.log(result.checkoutFormContent + '<div id="iyzipay-checkout-form" class="responsive"></div>');
        return resolve([
          result.checkoutFormContent as string,
          '<div id="iyzipay-checkout-form" class="responsive"></div>',
        ]);
      });
    });
  };
}
