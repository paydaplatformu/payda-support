import { Donation, LanguageCode, SubscriptionChargeResult, KeyValue, Package } from "../../generated/graphql";

export interface PayuService {
  getFormContents(donation: Donation, pkg: Package, language: LanguageCode): Promise<ReadonlyArray<KeyValue>>;
  verifyNotification(input: any): Promise<{ returnHash: string; donationId: string }>;
  chargeUsingToken(subscriptionId: string): Promise<SubscriptionChargeResult>;
  getPaymentToken(isAmex: boolean, payuReferenceNumber: string): Promise<string>;
}
