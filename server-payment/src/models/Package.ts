import { ObjectId } from "mongodb";
import { MonetaryAmount, Currency, RepeatInterval, PackageTag, PackageCustomizationConfig } from "../generated/graphql";

export interface PackageCreator {
  defaultTag: PackageTag;
  reference?: string | null;
  repeatInterval: RepeatInterval;
  image?: string | null;
  price: MonetaryAmount;
  customizationConfig: PackageCustomizationConfig;
  isCustom: boolean;
  priority: number;
  tags: ReadonlyArray<PackageTag>;
}

export interface PackageModifier {
  id: string;
  defaultTag: PackageTag;
  reference?: string;
  image?: string;
  isActive?: string;
  customizationConfig?: PackageCustomizationConfig;
  priority: number;
  tags: ReadonlyArray<PackageTag>;
}

export interface PackageEntity {
  _id: ObjectId;
  defaultTag: PackageTag;
  reference: string | null;
  createdAt: Date;
  updatedAt: Date;
  repeatInterval: RepeatInterval;
  image: string | null;
  price: MonetaryAmount;
  customizationConfig: PackageCustomizationConfig;
  isCustom: boolean;
  priority: number;
  tags: ReadonlyArray<PackageTag>;
  isActive: boolean;
}
