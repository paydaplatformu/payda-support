import { ObjectId } from "mongodb";
import { Currency } from "./Currency";
import { IMonetaryAmount } from "./MonetaryAmount";
import { IPackageTag } from "./PackageTag";
import { RepeatInterval } from "./RepeatInterval";

export interface IPackageCreator {
  defaultTag: IPackageTag;
  reference?: string;
  repeatInterval: RepeatInterval;
  image?: string;
  price: IMonetaryAmount;
  isCustomizable: boolean;
  isCustom: boolean;
  priority: number;
  tags: IPackageTag[];
}

export interface IPackageModifier {
  id: string;
  defaultTag: IPackageTag;
  reference?: string;
  image?: string;
  priority: number;
  tags: IPackageTag[];
}

export interface IPackageFilters {
  ids?: string[];
  onlyActive?: boolean;
  showCustom?: boolean;
  repeatInterval?: RepeatInterval;
  amount?: number;
  currency?: Currency;
  search?: string;
}

export interface IPackage {
  id: string;
  defaultTag: IPackageTag;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
  repeatInterval: RepeatInterval;
  image?: string;
  price: IMonetaryAmount;
  isCustomizable: boolean;
  isCustom: boolean;
  priority: number;
  tags: IPackageTag[];
  isActive: boolean;
}

export interface IPackageEntity {
  _id: ObjectId;
  defaultTag: IPackageTag;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
  repeatInterval: RepeatInterval;
  image?: string;
  price: IMonetaryAmount;
  isCustomizable: boolean;
  isCustom: boolean;
  priority: number;
  tags: IPackageTag[];
  isActive: boolean;
}
