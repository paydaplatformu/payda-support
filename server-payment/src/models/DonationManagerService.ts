import { IDonationCreator } from "./Donation";
import { DonationCreationResult } from "./DonationCreationResult";
import { LanguageCode } from "./LanguageCode";

export interface IDonationManagerService {
  createDonation(donationCreator: IDonationCreator, language: LanguageCode): Promise<DonationCreationResult>;
}
