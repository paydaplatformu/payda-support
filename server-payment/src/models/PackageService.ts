import { PackageCreator, PackageFilters, PackageModel, PackageModifier } from "./Package";
import { PaginationSettings } from "./PaginationSettings";
import { RepeatInterval } from "./RepeatInterval";
import { SortingSettings } from "./SortingSettings";

export interface PackageService {
  getDefaultFilters(): PackageFilters;
  getAll(filters: PackageFilters, pagination: PaginationSettings, sorting: SortingSettings): Promise<PackageModel[]>;
  count(filters: PackageFilters): Promise<number>;
  getById(id: string): Promise<PackageModel | null>;
  getByRepeatInterval(repeatInterval: RepeatInterval): Promise<PackageModel[]>;
  create(packageCreator: PackageCreator): Promise<PackageModel>;
  edit(packageModifier: PackageModifier): Promise<PackageModel | null>;
}
