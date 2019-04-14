import { ObjectId } from "mongodb";
import { Currency } from "./Currency";
import { IMonetaryAmount } from "./MonetaryAmount";
import { IPackageTag } from "./PackageTag";
import { RepeatConfig } from "./RepeatConfig";

export interface IPackageCreator {
  defaultTag: IPackageTag;
  reference?: string;
  repeatConfig: RepeatConfig;
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
  repeatConfig?: RepeatConfig;
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
  repeatConfig: RepeatConfig;
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
  repeatConfig: RepeatConfig;
  image?: string;
  price: IMonetaryAmount;
  isCustomizable: boolean;
  isCustom: boolean;
  priority: number;
  tags: IPackageTag[];
  isActive: boolean;
}
