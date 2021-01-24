import { Donation, LanguageCode, MonetaryAmount, Package, PackageRecurrenceConfig } from "../../generated/graphql";

export interface IyzicoPaymentResult {
  status: "success" | "failure";
  basketId: string;
  [t: string]: any;
}

export interface CreateIyzicoProduct {
  name: string;
  description: string | null;
}

export interface IyzicoProduct {
  referenceCode: string;
  name: string;
  description: string;
  pricingPlans: IyzicoPaymentPlan[];
}

export interface CreateIyzicoPaymentPlan {
  productReferenceCode: string;
  name: string;
  price: MonetaryAmount;
  recurrenceConfig: PackageRecurrenceConfig;
}

export interface IyzicoPaymentPlan {
  referenceCode: string;
  status: string;
}

export interface CreateIyzicoCustomer {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface IyzicoCustomer {
  email: string;
  referenceCode: string;
}

export interface IyzicoService {
  getFormContentsForSinglePayment(donation: Donation, pkg: Package, language: LanguageCode): Promise<string[]>;
  getFormContentsForSubscription(
    donation: Donation,
    pricingPlanReferenceCode: string,
    language: LanguageCode
  ): Promise<string[]>;
  retrievePaymentResult(token: string): Promise<IyzicoPaymentResult>;
  getWebhookSignature(iyziEventType: string, token: string): string;
  extractDonationIdFromReference(reference: string): string;

  getAllProducts(language: LanguageCode): Promise<IyzicoProduct[]>;
  getProduct(productReferenceCode: string): Promise<IyzicoProduct | null>;
  createProduct(input: CreateIyzicoProduct, language: LanguageCode): Promise<IyzicoProduct>;
  createPaymentPlan(input: CreateIyzicoPaymentPlan, language: LanguageCode): Promise<IyzicoPaymentPlan>;
  getAllCustomers(language: LanguageCode): Promise<IyzicoCustomer[]>;
  createCustomer(input: CreateIyzicoCustomer, language: LanguageCode): Promise<IyzicoCustomer>;
}
