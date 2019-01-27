import { injectable } from "inversify";
import { Cursor } from "mongodb";
import { IModifier } from "../models/Modifier";
import { IUser, IUserCreator, IUserEntity } from "../models/User";
import { BaseMongoService } from "./BaseMongoService";
import { IUserService } from "../models/UserService";
import { hashPassword, comparePassword } from "../utilities/password";

@injectable()
export class MongoUserService extends BaseMongoService<IUserEntity, IUser, {}, IUserCreator, IModifier> implements IUserService {
  public static collectionName = "users";

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

  public async createEntity(creator: IUserCreator): Promise<IUserEntity> {
    return {
      ...this.generateCommonFields(),
      email: creator.email,
      password: await hashPassword(creator.password),
      role: 'admin'
    }
  }

  public getUserCount(): Promise<number> {
    return this.count({})
  }

  public async getByEmailAndPassword(email: string, password: string): Promise<IUser | null> {
    const result = await this.collection.findOne({ email })

    if (result) {
      const passwordCorrect = await comparePassword(password, result.password)
      if (passwordCorrect) {
        return this.toModel(result)
      }
      return null
    }
    return null;
  }  
}
