import { ObjectID } from "bson";
import { injectable } from "inversify";
import { IPackage, IPackageCreator, IPackageEntity, IPackageModifier, IPackageFilters } from "../models/Package";
import { IPackageService } from "../models/PackageService";
import { BaseMongoService } from "./BaseMongoService";
import { Cursor } from "mongodb";

@injectable()
export class MongoPackageService extends BaseMongoService<IPackageEntity, IPackage, IPackageFilters, IPackageCreator, IPackageModifier> implements IPackageService {
  public static collectionName = "packages";

  public getFilteredQuery({ onlyActive }: IPackageFilters): Cursor<IPackageEntity> {
    if (onlyActive) {
      return this.collection.find({ isActive: true });
    }
    return this.collection.find();
  }

  public toModel(entity: IPackageEntity): IPackage {
    return {
      id: entity._id.toString(),
      createdAt: entity.createdAt,
      defaultTag: entity.defaultTag,
      image: entity.image,
      isActive: entity.isActive,
      price: entity.price,
      priority: entity.priority,
      reference: entity.reference,
      repeatConfig: entity.repeatConfig,
      tags: entity.tags,
      updatedAt: entity.updatedAt
    };
  }
}
