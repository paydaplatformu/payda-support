import { IDonation } from "./Donation";
import { IPackage } from "./Package";
import { LanguageCode } from "./LanguageCode";
import { KeyValuePair } from "./KeyValuePair";

export interface IPayuService {
  getFormContents(donation: IDonation, pkg: IPackage, language: LanguageCode): Promise<KeyValuePair<string, string>[]>;
  verifyNotification(input: any): Promise<{ returnHash: string; donationId: string }>;
}
