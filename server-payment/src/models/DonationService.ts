import { IDonation, IDonationCreator } from "./Donation";

export interface IDonationService {
  getAll(): Promise<IDonation[]>;
  getByPackageId(packageId: string): Promise<IDonation[]>;
  getById(id: string): Promise<IDonation | null>;
  create(packageCreator: IDonationCreator): Promise<IDonation>;
  cleanPendingDonations(): Promise<number>;
}
