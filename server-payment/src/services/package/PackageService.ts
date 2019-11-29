import { PackageCreator, PackageModifier } from "../../models/Package";
import { PaginationSettings } from "../../models/PaginationSettings";
import { SortingSettings } from "../../models/SortingSettings";
import { RepeatInterval, PackageFilter, Package } from "../../generated/graphql";

export interface PackageService {
  getDefaultFilters(): Partial<PackageFilter>;
  getAll(
    filters: Partial<PackageFilter> | null,
    pagination: PaginationSettings | null,
    sorting: SortingSettings | null
  ): Promise<Package[]>;
  count(filters: Partial<PackageFilter> | null): Promise<number>;
  getById(id: string): Promise<Package | null>;
  getByRepeatInterval(repeatInterval: RepeatInterval): Promise<Package[]>;
  create(packageCreator: PackageCreator): Promise<Package>;
  edit(packageModifier: PackageModifier): Promise<Package | null>;
}
