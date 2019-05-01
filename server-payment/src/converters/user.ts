import { UserEntity } from "../entities/UserEntity";
import { UserModel } from "../models/User";

export const userEntityToModel = (user: UserEntity): UserModel => ({
  createdAt: user.createdAt,
  email: user.email,
  id: user.id,
  role: user.role
});
