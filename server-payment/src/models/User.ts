import { ObjectId } from "mongodb";

export interface UserCreator {
  email: string;
  password: string;
}

export interface UserModel {
  id: string;
  email: string;
  createdAt: Date;
  role: string;
}

export interface UserEntity {
  _id: ObjectId;
  email: string;
  createdAt: Date;
  role: string;
  password: string;
}
