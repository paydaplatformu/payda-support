import { injectable } from "inversify";
import { userEntityToModel } from "../converters/user";
import { IUserEntity } from "../entities/UserEntity";
import { IUserCreator } from "../models/User";
import { IUserService } from "../models/UserService";

@injectable()
export class MockUserService implements IUserService {
  private users: IUserEntity[];

  constructor() {
    this.users = [];
  }

  public getAll = async () => {
    return this.users.map(userEntityToModel);
  }

  public create = async (userCreator: IUserCreator) => {
    const newUser: IUserEntity = {
      id: Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 5),
      createdAt: new Date(),
      email: userCreator.email,
      password: userCreator.password,
      role: "admin"
    };
    this.users.push(newUser);
    return userEntityToModel(newUser);
  };

  public getByEmailAndPassword = async (email: string, password: string) => {
    return this.users.find(u => u.email === email && u.password === password) || null;
  };

  public getUserCount = async () => {
    return this.users.length;
  };
}
