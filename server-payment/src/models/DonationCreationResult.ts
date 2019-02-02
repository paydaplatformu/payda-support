import { IDonation } from "./Donation";
import { KeyValuePair } from "./KeyValuePair";
import { IPackage } from "./Package";
import { ISubscription } from "./Subscription";

export interface DonationCreationResult {
  donation: IDonation;
  package: IPackage;
  subscription?: ISubscription;
  formUrl: string;
  formFields: Array<KeyValuePair<string, string>>;
}
