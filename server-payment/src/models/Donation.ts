import { ObjectId } from "mongodb";
import { Currency, RepeatInterval } from "../generated/graphql";

export interface DonationModifier {
  id: string;
  paymentConfirmed: boolean;
}

export interface DonationCreator {
  fullName: string;
  email: string;
  packageId: string;
  customPriceAmount: number | null;
  customPriceCurrency: Currency | null;
  customRepeatInterval: RepeatInterval | null;
  quantity: number;
  usingAmex: boolean;
  notes: string | null;
  parentDonationId?: string;
}

export interface DonationEntity {
  _id: ObjectId;
  fullName: string;
  email: string;
  packageId: ObjectId;
  notes: string | null;
  paymentConfirmed: boolean;
  date: Date;
  quantity: number;
  usingAmex: boolean;
  parentDonationId?: ObjectId;
}
