import { DonationModel, DonationCreator, DonationFilters } from "./Donation";
import { PaginationSettings } from "./PaginationSettings";
import { SortingSettings } from "./SortingSettings";

export interface IDonationService {
  getAll(filters: DonationFilters, pagination: PaginationSettings, sorting: SortingSettings): Promise<DonationModel[]>;
  confirmPayment(donationId: string): Promise<DonationModel | null>;
  count(filters: DonationFilters): Promise<number>;
  getByPackageId(packageId: string): Promise<DonationModel[]>;
  countByPackageId(packageId: string): Promise<number>;
  getById(id: string): Promise<DonationModel | null>;
  create(packageCreator: DonationCreator): Promise<DonationModel>;
  cleanPendingDonations(): Promise<number>;
}
