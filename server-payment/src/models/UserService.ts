import { PaginationSettings } from "./PaginationSettings";
import { SortingSettings } from "./SortingSettings";
import { IUser, IUserCreator } from "./User";

export interface IUserService {
  getUserCount(): Promise<number>;
  getAll(filters: {}, pagination: PaginationSettings, sorting: SortingSettings): Promise<IUser[]>;
  create(userCreator: IUserCreator): Promise<IUser>;
  getByEmailAndPassword(email: string, password: string): Promise<IUser | null>;
}
