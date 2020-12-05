import { SubscriptionChargeResult } from "../../generated/graphql";
import { Donation, LanguageCode, Package } from "../../generated/graphql";

export interface IyzicoPaymentResult {
  status: "success" | "failure";
  basketId: string;
  [t: string]: any;
}

export interface IyzicoService {
  getFormContents(donation: Donation, pkg: Package, language: LanguageCode): Promise<string[]>;
  retrievePaymentResult(token: string): Promise<IyzicoPaymentResult>;
  getWebhookSignature(iyziEventType: string, token: string): string;
  extractDonationIdFromReference(reference: string): string;
  chargeUsingToken(subscriptionId: string): Promise<SubscriptionChargeResult>;
}
