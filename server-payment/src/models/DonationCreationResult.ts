import { DonationModel } from "./Donation";
import { KeyValuePair } from "./KeyValuePair";
import { PackageModel } from "./Package";
import { SubscriptionModel } from "./Subscription";

export interface DonationCreationResult {
  donation: DonationModel;
  package: PackageModel;
  subscription?: SubscriptionModel;
  formUrl: string;
  formFields: Array<KeyValuePair<string, string>>;
}
