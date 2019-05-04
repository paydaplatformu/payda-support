import { ObjectId } from "mongodb";
import { Currency } from "./Currency";
import { RepeatInterval } from "./RepeatInterval";

export interface DonationCreator {
  fullName: string;
  email: string;
  packageId: string;
  customPriceAmount?: number;
  customPriceCurrency?: Currency;
  customRepeatInterval?: RepeatInterval;
  quantity: number;
  usingAmex: boolean;
  notes?: string;
  parentDonationId?: string;
}

export interface DonationModifier {
  id: string;
  paymentConfirmed: boolean;
}

export interface DonationFilters {
  paymentConfirmed?: boolean;
  search?: string;
  ids?: string[];
  packageId?: string;
  onlyDirect?: boolean;
}

export interface DonationModel {
  id: string;
  fullName: string;
  email: string;
  packageId: string;
  notes?: string;
  paymentConfirmed: boolean;
  date: Date;
  quantity: number;
  usingAmex: boolean;
  parentDonationId?: string;
}

export interface DonationEntity {
  _id: ObjectId;
  fullName: string;
  email: string;
  packageId: ObjectId;
  notes?: string;
  paymentConfirmed: boolean;
  date: Date;
  quantity: number;
  usingAmex: boolean;
  parentDonationId?: ObjectId;
}
