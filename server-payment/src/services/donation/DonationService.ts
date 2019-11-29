import { DonationCreator } from "../../models/Donation";
import { PaginationSettings } from "../../models/PaginationSettings";
import { SortingSettings } from "../../models/SortingSettings";
import { Donation, DonationFilter } from "../../generated/graphql";

export interface DonationService {
  getAll(
    filters: Partial<DonationFilter> | null,
    pagination: PaginationSettings | null,
    sorting: SortingSettings | null
  ): Promise<Donation[]>;
  confirmPayment(donationId: string): Promise<Donation | null>;
  count(filters: Partial<DonationFilter> | null): Promise<number>;
  getByPackageId(packageId: string): Promise<Donation[]>;
  countByPackageId(packageId: string): Promise<number>;
  getById(id: string): Promise<Donation | null>;
  create(donationCreator: DonationCreator): Promise<Donation>;
  cleanPendingDonations(): Promise<number>;
}
