import { ObjectId } from "mongodb";

export interface IUserCreator {
  email: string;
  password: string;
}

export interface IUser {
  id: string;
  email: string;
  createdAt: Date;
  role: string;
}

export interface IUserEntity {
  _id: ObjectId;
  email: string;
  createdAt: Date;
  role: string;
  password: string;
}
