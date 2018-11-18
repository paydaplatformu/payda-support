import { IUserEntity } from "../entities/UserEntity";
import { IUser } from "../models/User";

export const userEntityToModel = (user: IUserEntity): IUser => ({
  createdAt: user.createdAt,
  email: user.email,
  id: user.id,
  role: user.role
});
