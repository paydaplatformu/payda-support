import { ObjectId } from "mongodb";
import { Currency, RepeatInterval } from "../generated/graphql";

export interface DonationModifier {
  paymentConfirmed: boolean;
}

export interface DonationCreator {
  fullName: string;
  email: string;
  ip: string;
  packageId: string;
  customPriceAmount: number | null;
  customPriceCurrency: Currency | null;
  customRepeatInterval: RepeatInterval | null;
  quantity: number;
  notes: string | null;
  parentDonationId?: string;
}

export interface DonationEntity {
  _id: ObjectId;
  fullName: string;
  email: string;
  ip: string | null;
  packageId: ObjectId;
  notes: string | null;
  paymentConfirmed: boolean;
  date: Date;
  quantity: number;
  parentDonationId?: ObjectId;
}
