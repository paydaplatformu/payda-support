import { DonationModel } from "./Donation";
import { KeyValuePair } from "./KeyValuePair";
import { LanguageCode } from "./LanguageCode";
import { PackageModel } from "./Package";
import { SubscriptionChargeResult } from "./SubscriptionChargeResult";

export interface PayuService {
  getFormContents(
    donation: DonationModel,
    pkg: PackageModel,
    language: LanguageCode
  ): Promise<Array<KeyValuePair<string, string>>>;
  verifyNotification(input: any): Promise<{ returnHash: string; donationId: string }>;
  chargeUsingToken(subscriptionId: string): Promise<SubscriptionChargeResult>;
  getPaymentToken(isAmex: boolean, payuReferenceNumber: string): Promise<string>;
}
