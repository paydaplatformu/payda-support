import { ObjectId } from "mongodb";
import { LastProcess } from "./LastProcess";

export interface ISubscriptionCreator {
  packageId: string;
  donationId: string;
}

export interface ISubscriptionModifier {
  id: string;
  isActive: boolean;
}

export interface ISubscriptionFilters {
  ids?: string[];
  onlyActive?: boolean;
}

export interface ISubscriptionBase {
  id: string;
  packageId: string;
  donationId: string;
  lastProcess: LastProcess | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InitiatedSubscription extends ISubscriptionBase {
  lastProcess: LastProcess;
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
  lastProcess: LastProcess | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InitiatedSubscriptionEntity extends ISubscriptionEntityBase {
  lastProcess: LastProcess;
  paymentToken: string;
}

export interface PendingSubscriptionEntity extends ISubscriptionEntityBase {
  lastProcess: null;
  paymentToken: null;
}

export type ISubscriptionEntity = InitiatedSubscriptionEntity | PendingSubscriptionEntity;

