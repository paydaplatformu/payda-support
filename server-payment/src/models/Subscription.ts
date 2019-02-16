import { ObjectId } from "mongodb";
import { DeactivationReason } from "./DeactivationReason";
import { LanguageCode } from "./LanguageCode";
import { PaymentProcess } from "./PaymentProcess";
import { SubscriptionStatus } from "./SubscriptionStatus";

export interface ISubscriptionCreator {
  packageId: string;
  donationId: string;
  language: LanguageCode;
}

export interface ISubscriptionModifier {
  id: string;
  status?: SubscriptionStatus;
  paymentToken?: string | null;
  processHistory?: PaymentProcess[];
  deactivationReason?: DeactivationReason | null;
}

export interface ISubscriptionFilters {
  ids?: string[];
  status?: SubscriptionStatus;
}

export interface ISubscriptionBase {
  id: string;
  status: SubscriptionStatus;
  packageId: string;
  donationId: string;
  processHistory: PaymentProcess[];
  language: LanguageCode;
  deactivationReason: DeactivationReason | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatedSubscription extends ISubscriptionBase {
  status: SubscriptionStatus.CREATED;
  deactivationReason: null;
}

export interface IRunningSubscription extends ISubscriptionBase {
  status: SubscriptionStatus.RUNNING;
  deactivationReason: null;
}

export interface ICancelledSubscription extends ISubscriptionBase {
  status: SubscriptionStatus.CANCELLED;
  deactivationReason: DeactivationReason;
}

export type ISubscription = ICreatedSubscription | IRunningSubscription | ICancelledSubscription;

export interface ISubscriptionEntityBase {
  _id: ObjectId;
  paymentToken: string | null;
  packageId: ObjectId;
  donationId: ObjectId;
  processHistory: PaymentProcess[];
  language: LanguageCode;
  deactivationReason: DeactivationReason | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatedSubscriptionEntity extends ISubscriptionEntityBase {
  status: SubscriptionStatus.CREATED;
  deactivationReason: null;
  paymentToken: null;
}

export interface IRunningSubscriptionEntity extends ISubscriptionEntityBase {
  status: SubscriptionStatus.RUNNING;
  deactivationReason: null;
  paymentToken: string;
}

export interface ICancelledSubscriptionEntity extends ISubscriptionEntityBase {
  status: SubscriptionStatus.CANCELLED;
  deactivationReason: DeactivationReason;
  paymentToken: null;
}

export type ISubscriptionEntity =
  | ICreatedSubscriptionEntity
  | IRunningSubscriptionEntity
  | ICancelledSubscriptionEntity;
