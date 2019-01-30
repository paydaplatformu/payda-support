import { IDonation, IDonationCreator, IDonationFilters } from "./Donation";
import { PaginationSettings } from "./PaginationSettings";
import { SortingSettings } from "./SortingSettings";

export interface IDonationService {
  getAll(filters: IDonationFilters, pagination: PaginationSettings, sorting: SortingSettings): Promise<IDonation[]>;
  confirmPayment(donationId: string): Promise<IDonation | null>;
  count(filters: IDonationFilters): Promise<number>;
  getByPackageId(packageId: string): Promise<IDonation[]>;
  countByPackageId(packageId: string): Promise<number>;
  getById(id: string): Promise<IDonation | null>;
  create(packageCreator: IDonationCreator): Promise<IDonation>;
  cleanPendingDonations(): Promise<number>;
}
