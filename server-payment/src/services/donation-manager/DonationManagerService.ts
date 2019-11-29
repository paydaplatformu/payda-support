import { DonationCreator } from "../../models/Donation";
import { LanguageCode, DonationCreationResult } from "../../generated/graphql";

export interface DonationManagerService {
  createDonation(donationCreator: DonationCreator, language: LanguageCode): Promise<DonationCreationResult>;
}
