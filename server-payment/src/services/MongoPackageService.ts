import { injectable } from "inversify";
import { IPackage, IPackageCreator, IPackageEntity, IPackageModifier, IPackageFilters } from "../models/Package";
import { IPackageService } from "../models/PackageService";
import { BaseMongoService } from "./BaseMongoService";
import { Cursor, ObjectID } from "mongodb";

@injectable()
export class MongoPackageService extends BaseMongoService<IPackageEntity, IPackage, IPackageFilters, IPackageCreator, IPackageModifier> implements IPackageService {
  public static collectionName = "packages";

  public getFilteredQuery({ onlyActive, ids }: IPackageFilters): Cursor<IPackageEntity> {
    // if
    const filters = [
      onlyActive !== undefined ? { isActive: onlyActive } : undefined,
      ids !== undefined ? { _id: { $in: ids.map(id => new ObjectID(id)) } } : undefined
    ].filter(el => el !== undefined)

    return this.collection.find({
      $and: filters
    });
  }

  public async createEntity(creator: IPackageCreator): Promise<IPackageEntity> {
    const fromSuper = await super.createEntity(creator);
    return {
      ...fromSuper,
      tags: fromSuper.tags || []
    }
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
