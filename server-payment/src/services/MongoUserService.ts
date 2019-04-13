import { injectable } from "inversify";
import { Cursor } from "mongodb";
import { IModifier } from "../models/Modifier";
import { IUser, IUserCreator, IUserEntity } from "../models/User";
import { IUserService } from "../models/UserService";
import { Validator } from "../models/Validator";
import { comparePassword, hashPassword } from "../utilities/password";
import { BaseMongoService } from "./BaseMongoService";

@injectable()
export class MongoUserService extends BaseMongoService<IUserEntity, IUser, {}, IUserCreator, IModifier>
  implements IUserService {
  protected getFilters = (): object[] => [];

  protected toModel = (entity: IUserEntity): IUser => {
    return {
      id: entity._id.toString(),
      createdAt: entity.createdAt,
      email: entity.email,
      role: entity.role
    };
  };

  public getByEmailAndPassword = async (email: string, password: string): Promise<IUser | null> => {
    const result = await this.collection.findOne({ email });

    if (result) {
      const passwordCorrect = await comparePassword(password, result.password);
      if (passwordCorrect) {
        return this.toModel(result);
      }
      return null;
    }
    return null;
  };

  public getUserCount = (): Promise<number> => {
    return this.count({});
  };

  protected createEntity = async (creator: IUserCreator): Promise<IUserEntity> => {
    return {
      ...this.generateCommonFields(),
      email: creator.email,
      password: await hashPassword(creator.password),
      role: "admin"
    };
  };

  protected creatorValidator: Validator<IUserCreator> = {};

  protected static collectionName = "users";
}
