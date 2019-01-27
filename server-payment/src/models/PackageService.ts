import { IPackage, IPackageCreator, IPackageModifier, IPackageFilters } from "./Package";
import { PaginationSettings } from "./PaginationSettings";
import { SortingSettings } from "./SortingSettings";

export interface IPackageService {
  getAll(filters: IPackageFilters, pagination: PaginationSettings, sorting: SortingSettings): Promise<IPackage[]>;
  count(filters: IPackageFilters): Promise<number>;
  getById(id: string): Promise<IPackage | null>;
  create(packageCreator: IPackageCreator): Promise<IPackage>;
  edit(packageModifier: IPackageModifier): Promise<IPackage | null>;
}
