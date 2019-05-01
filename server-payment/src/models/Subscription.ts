import { ObjectId } from "mongodb";
import { DeactivationReason } from "./DeactivationReason";
import { LanguageCode } from "./LanguageCode";
import { PaymentProcess } from "./PaymentProcess";
import { RepeatInterval } from "./RepeatInterval";
import { SubscriptionStatus } from "./SubscriptionStatus";

export interface SubscriptionCreator {
  packageId: string;
  donationId: string;
  language: LanguageCode;
}

export interface SubscriptionModifier {
  id: string;
  status?: SubscriptionStatus;
  paymentToken?: string | null;
  processHistory?: PaymentProcess[];
  deactivationReason?: DeactivationReason | null;
}

export interface SubscriptionFilters {
  ids?: string[];
  status?: SubscriptionStatus;
  repeatInterval?: RepeatInterval;
}

export interface SubscriptionBaseModel {
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

export interface CreatedSubscriptionModel extends SubscriptionBaseModel {
  status: SubscriptionStatus.CREATED;
  deactivationReason: null;
}

export interface RunningSubscriptionModel extends SubscriptionBaseModel {
  status: SubscriptionStatus.RUNNING;
  deactivationReason: null;
}

export interface CancelledSubscriptionModel extends SubscriptionBaseModel {
  status: SubscriptionStatus.CANCELLED;
  deactivationReason: DeactivationReason;
}

export type SubscriptionModel = CreatedSubscriptionModel | RunningSubscriptionModel | CancelledSubscriptionModel;

export interface SubscriptionBaseEntity {
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

export interface CreatedSubscriptionEntity extends SubscriptionBaseEntity {
  status: SubscriptionStatus.CREATED;
  deactivationReason: null;
  paymentToken: null;
}

export interface RunningSubscriptionEntity extends SubscriptionBaseEntity {
  status: SubscriptionStatus.RUNNING;
  deactivationReason: null;
  paymentToken: string;
}

export interface CancelledSubscriptionEntity extends SubscriptionBaseEntity {
  status: SubscriptionStatus.CANCELLED;
  deactivationReason: DeactivationReason;
  paymentToken: null;
}

export type SubscriptionEntity =
  | CreatedSubscriptionEntity
  | RunningSubscriptionEntity
  | CancelledSubscriptionEntity;
