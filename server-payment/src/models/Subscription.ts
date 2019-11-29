import { ObjectId } from "mongodb";
import {
  LanguageCode,
  Subscription,
  SubscriptionStatus,
  DeactivationReason,
  PaymentProcess
} from "../generated/graphql";

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

export interface CreatedSubscription extends Subscription {
  status: SubscriptionStatus.Created;
  deactivationReason: null;
}

export interface RunningSubscription extends Subscription {
  status: SubscriptionStatus.Running;
  deactivationReason: null;
}

export interface CancelledSubscription extends Subscription {
  status: SubscriptionStatus.Cancelled;
  deactivationReason: DeactivationReason;
}

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
  status: SubscriptionStatus.Created;
  deactivationReason: null;
  paymentToken: null;
}

export interface RunningSubscriptionEntity extends SubscriptionBaseEntity {
  status: SubscriptionStatus.Running;
  deactivationReason: null;
  paymentToken: string;
}

export interface CancelledSubscriptionEntity extends SubscriptionBaseEntity {
  status: SubscriptionStatus.Cancelled;
  deactivationReason: DeactivationReason;
  paymentToken: null;
}

export type SubscriptionEntity = CreatedSubscriptionEntity | RunningSubscriptionEntity | CancelledSubscriptionEntity;
