import { IPackage, IPackageCreator, IPackageModifier } from "./Package";
import { IPackageFilters } from "./PackageFilters";

export interface IPackageService {
  getAll(filters: IPackageFilters): Promise<IPackage[]>;
  getById(id: string): Promise<IPackage | null>;
  create(packageCreator: IPackageCreator): Promise<IPackage>;
  edit(packageModifier: IPackageModifier): Promise<IPackage | null>;
  activate(id: string): Promise<string | null>;
  deactivate(id: string): Promise<string | null>;
}
