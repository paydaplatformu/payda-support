import { ObjectID } from "mongodb";

export interface IDonationCreator {
  fullName: string;
  email: string;
  packageId: string;
  quantity: number;
  usingAmex: boolean;
}

export interface IDonationModifier {
  id: string;
  paymentConfirmed: boolean;
}

export interface IDonationFilters {
  paymentConfirmed?: boolean;
}

export interface IDonation {
  id: string;
  fullName: string;
  email: string;
  packageId: string;
  paymentConfirmed: boolean;
  date: Date;
  quantity: number;
  usingAmex: boolean;
}

export interface IDonationEntity {
  _id: ObjectID;
  fullName: string;
  email: string;
  packageId: string;
  paymentConfirmed: boolean;
  date: Date;
  quantity: number;
  usingAmex: boolean;
}
