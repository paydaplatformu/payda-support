import { ObjectID } from "mongodb";
import { IMonateryAmount } from "./MonetaryAmount";
import { IPackageTag } from "./PackageTag";
import { RepeatConfig } from "./RepeatConfig";

export interface IPackageCreator {
  defaultTag: IPackageTag;
  reference?: string;
  repeatConfig: RepeatConfig;
  image?: string;
  price: IMonateryAmount;
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
}

export interface IPackage {
  id: string;
  defaultTag: IPackageTag;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
  repeatConfig: RepeatConfig;
  image?: string;
  price: IMonateryAmount;
  priority: number;
  tags: IPackageTag[];
  isActive: boolean;
}

export interface IPackageEntity {
  _id: ObjectID;
  defaultTag: IPackageTag;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
  repeatConfig: RepeatConfig;
  image?: string;
  price: IMonateryAmount;
  priority: number;
  tags: IPackageTag[];
  isActive: boolean;
}
