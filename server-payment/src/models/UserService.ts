import { PaginationSettings } from "./PaginationSettings";
import { SortingSettings } from "./SortingSettings";
import { UserModel, UserCreator } from "./User";

export interface UserService {
  getUserCount(): Promise<number>;
  getAll(filters: {}, pagination: PaginationSettings, sorting: SortingSettings): Promise<UserModel[]>;
  create(userCreator: UserCreator): Promise<UserModel>;
  getByEmailAndPassword(email: string, password: string): Promise<UserModel | null>;
}
