import { ObjectId } from "mongodb";

export interface IDonationCreator {
  fullName: string;
  email: string;
  packageId: string;
  quantity: number;
  usingAmex: boolean;
  notes?: string;
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
  notes?: string;
  paymentConfirmed: boolean;
  date: Date;
  quantity: number;
  usingAmex: boolean;
}

export interface IDonationEntity {
  _id: ObjectId;
  fullName: string;
  email: string;
  packageId: ObjectId;
  notes?: string;
  paymentConfirmed: boolean;
  date: Date;
  quantity: number;
  usingAmex: boolean;
}
