import { IUser, IUserCreator } from "./User";

export interface IUserService {
  getUserCount(): Promise<number>;
  getAll(): Promise<IUser[]>;
  create(userCreator: IUserCreator): Promise<IUser>;
  getByEmailAndPassword(email: string, password: string): Promise<IUser | null>;
}
