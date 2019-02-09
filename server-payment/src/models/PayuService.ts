import { IDonation } from "./Donation";
import { KeyValuePair } from "./KeyValuePair";
import { LanguageCode } from "./LanguageCode";
import { IPackage } from "./Package";
import { ISubscription } from "./Subscription";

export interface IPayuService {
  getFormContents(
    donation: IDonation,
    pkg: IPackage,
    language: LanguageCode
  ): Promise<Array<KeyValuePair<string, string>>>;
  verifyNotification(input: any): Promise<{ returnHash: string; donationId: string }>;
  chargeUsingToken(subscription: ISubscription, paymentToken: string): Promise<{ status: boolean; body: string }>;
}
