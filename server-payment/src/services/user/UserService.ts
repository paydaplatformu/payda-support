import { PaginationSettings } from "../../models/PaginationSettings";
import { SortingSettings } from "../../models/SortingSettings";
import { UserCreator, UserModel } from "../../models/User";

export interface UserService {
  getUserCount(): Promise<number>;
  getAll(filters: {}, pagination: PaginationSettings, sorting: SortingSettings): Promise<UserModel[]>;
  create(userCreator: UserCreator): Promise<UserModel>;
  getByEmailAndPassword(email: string, password: string): Promise<UserModel | null>;
}
