import { IMonetaryAmount } from "./MonetaryAmount";
import { IPackage, IPackageCreator, IPackageFilters, IPackageModifier } from "./Package";
import { PaginationSettings } from "./PaginationSettings";
import { RepeatInterval } from "./RepeatInterval";
import { SortingSettings } from "./SortingSettings";

export interface IPackageService {
  getDefaultFilters(): IPackageFilters;
  getAll(filters: IPackageFilters, pagination: PaginationSettings, sorting: SortingSettings): Promise<IPackage[]>;
  count(filters: IPackageFilters): Promise<number>;
  getById(id: string): Promise<IPackage | null>;
  getByRepeatInterval(repeatInterval: RepeatInterval): Promise<IPackage[]>;
  create(packageCreator: IPackageCreator): Promise<IPackage>;
  edit(packageModifier: IPackageModifier): Promise<IPackage | null>;
  isCustomPrice(originalPrice: IMonetaryAmount, price: IMonetaryAmount): boolean;
}
