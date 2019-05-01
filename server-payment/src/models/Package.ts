import { ObjectId } from "mongodb";
import { Currency } from "./Currency";
import { MonetaryAmount } from "./MonetaryAmount";
import { PackageCustomizationConfig } from "./PackageCustomizationConfig";
import { PackageTag } from "./PackageTag";
import { RepeatInterval } from "./RepeatInterval";

export interface PackageCreator {
  defaultTag: PackageTag;
  reference?: string;
  repeatInterval: RepeatInterval;
  image?: string;
  price: MonetaryAmount;
  customizationConfig: PackageCustomizationConfig;
  isCustom: boolean;
  priority: number;
  tags: PackageTag[];
}

export interface PackageModifier {
  id: string;
  defaultTag: PackageTag;
  reference?: string;
  image?: string;
  priority: number;
  tags: PackageTag[];
}

export interface PackageFilters {
  ids?: string[];
  onlyActive?: boolean;
  onlyOriginal?: boolean;
  repeatInterval?: RepeatInterval;
  amount?: number;
  currency?: Currency;
  search?: string;
}

export interface PackageModel {
  id: string;
  defaultTag: PackageTag;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
  repeatInterval: RepeatInterval;
  image?: string;
  price: MonetaryAmount;
  customizationConfig: PackageCustomizationConfig;
  isCustom: boolean;
  priority: number;
  tags: PackageTag[];
  isActive: boolean;
}

export interface PackageEntity {
  _id: ObjectId;
  defaultTag: PackageTag;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
  repeatInterval: RepeatInterval;
  image?: string;
  price: MonetaryAmount;
  customizationConfig: PackageCustomizationConfig;
  isCustom: boolean;
  priority: number;
  tags: PackageTag[];
  isActive: boolean;
}
