import { injectable } from "inversify";
import { UserModel, UserCreator, UserEntity } from "../../models/User";
import { UserService } from "./UserService";
import { Validator } from "../../models/Validator";
import { comparePassword, hashPassword } from "../../utilities/password";
import { BaseMongoService } from "../BaseMongoService";

@injectable()
export class MongoUserService extends BaseMongoService<UserEntity, UserModel, {}, UserCreator, {}>
  implements UserService {
  protected getFilters = (): object[] => [];

  protected toModel = (entity: UserEntity): UserModel => {
    return {
      id: entity._id.toString(),
      createdAt: entity.createdAt,
      email: entity.email,
      role: entity.role
    };
  };

  public getByEmailAndPassword = async (email: string, password: string): Promise<UserModel | null> => {
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

  protected createEntity = async (creator: UserCreator): Promise<UserEntity> => {
    return {
      ...this.generateCommonFields(),
      email: creator.email,
      password: await hashPassword(creator.password),
      role: "admin"
    };
  };

  protected creatorValidator: Validator<UserCreator> = {};

  protected static collectionName = "users";
}
