import { ObjectId } from "mongodb";
import { LanguageCode } from "./LanguageCode";
import { PaymentProcess } from "./PaymentProcess";

export interface ISubscriptionCreator {
  packageId: string;
  donationId: string;
  language: LanguageCode;
}

export interface ISubscriptionModifier {
  id: string;
  isActive?: boolean;
  paymentToken?: string;
  lastProcess?: PaymentProcess;
}

export interface ISubscriptionFilters {
  ids?: string[];
  onlyActive?: boolean;
}

export interface ISubscriptionBase {
  id: string;
  packageId: string;
  donationId: string;
  lastProcess: PaymentProcess | null;
  language: LanguageCode;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InitiatedSubscription extends ISubscriptionBase {
  lastProcess: PaymentProcess;
}

export interface PendingSubscription extends ISubscriptionBase {
  lastProcess: null;
}

export type ISubscription = InitiatedSubscription | PendingSubscription;

export interface ISubscriptionEntityBase {
  _id: ObjectId;
  paymentToken: string | null;
  packageId: ObjectId;
  donationId: ObjectId;
  lastProcess: PaymentProcess | null;
  language: LanguageCode;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InitiatedSubscriptionEntity extends ISubscriptionEntityBase {
  lastProcess: PaymentProcess;
  paymentToken: string;
}

export interface PendingSubscriptionEntity extends ISubscriptionEntityBase {
  lastProcess: null;
  paymentToken: null;
}

export type ISubscriptionEntity = InitiatedSubscriptionEntity | PendingSubscriptionEntity;

