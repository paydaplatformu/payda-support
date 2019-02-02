import { ObjectId } from "mongodb";
import { LastProcess } from "./LastProcess";

export interface ISubscriptionCreator {
  packageId: string;
  donationId: string;
  lastProcess: LastProcess;
}

export interface ISubscriptionModifier {
  id: string;
  isActive: boolean;
}

export interface ISubscriptionFilters {
  ids?: string[];
  onlyActive?: boolean;
}

export interface ISubscription {
  id: string;
  packageId: string;
  donationId: string;
  lastProcess: LastProcess | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriptionEntity {
  _id: ObjectId;
  packageId: ObjectId;
  donationId: ObjectId;
  lastProcess: LastProcess | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
