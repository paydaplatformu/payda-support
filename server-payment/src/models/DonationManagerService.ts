import { DonationCreator } from "./Donation";
import { DonationCreationResult } from "./DonationCreationResult";
import { LanguageCode } from "./LanguageCode";

export interface DonationManagerService {
  createDonation(donationCreator: DonationCreator, language: LanguageCode): Promise<DonationCreationResult>;
}
