import { IMonetaryAmount } from "./MonetaryAmount";
import { IPackage, IPackageCreator, IPackageFilters, IPackageModifier } from "./Package";
import { PaginationSettings } from "./PaginationSettings";
import { SortingSettings } from "./SortingSettings";

export interface IPackageService {
  getAll(filters: IPackageFilters, pagination: PaginationSettings, sorting: SortingSettings): Promise<IPackage[]>;
  count(filters: IPackageFilters): Promise<number>;
  getById(id: string): Promise<IPackage | null>;
  create(packageCreator: IPackageCreator): Promise<IPackage>;
  edit(packageModifier: IPackageModifier): Promise<IPackage | null>;
  isCustomPrice(originalPrice: IMonetaryAmount, price: IMonetaryAmount): boolean;
}
