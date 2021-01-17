import { ObjectId } from "mongodb";
import { MonetaryAmount, PackageTag, PackageCustomizationConfig, PackageRecurrenceConfig } from "../generated/graphql";

export interface PackageCreator {
  defaultTag: PackageTag;
  reference?: string | null;
  image?: string | null;
  price: MonetaryAmount;
  recurrenceConfig: PackageRecurrenceConfig;
  customizationConfig: PackageCustomizationConfig;
  isCustom: boolean;
  priority: number;
  tags: ReadonlyArray<PackageTag>;
}

export interface PackageModifier {
  defaultTag: PackageTag;
  reference: string | null;
  image: string | null;
  isActive: boolean;
  recurrenceConfig: PackageRecurrenceConfig;
  customizationConfig: PackageCustomizationConfig;
  priority: number;
  tags: ReadonlyArray<PackageTag>;
}

export interface PackageEntity {
  _id: ObjectId;
  defaultTag: PackageTag;
  reference: string | null;
  createdAt: Date;
  updatedAt: Date;
  image: string | null;
  price: MonetaryAmount;
  recurrenceConfig: PackageRecurrenceConfig;
  customizationConfig: PackageCustomizationConfig;
  isCustom: boolean;
  priority: number;
  tags: ReadonlyArray<PackageTag>;
  isActive: boolean;
}
