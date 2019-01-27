import { injectable } from "inversify";
import { Cursor } from "mongodb";
import { IModifier } from "../models/Modifier";
import { IUser, IUserCreator, IUserEntity } from "../models/User";
import { BaseMongoService } from "./BaseMongoService";
import { IUserService } from "../models/UserService";

@injectable()
export class MongoUserService extends BaseMongoService<IUserEntity, IUser, {}, IUserCreator, IModifier> implements IUserService {
  public static collectionName = "Users";

  public getFilteredQuery(): Cursor<IUserEntity> {
    return this.collection.find();
  }

  public toModel(entity: IUserEntity): IUser {
    return {
      id: entity._id.toString(),
      createdAt: entity.createdAt,
      email: entity.email,
      role: entity.role
    };
  }

  public getUserCount(): Promise<number> {
    return this.count({})
  }

  public getByEmailAndPassword(email: string, password: string): Promise<IUser | null> {
    throw new Error("Method not implemented.");
  }  
}
