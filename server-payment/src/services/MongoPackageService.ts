import { injectable } from "inversify";
import { Cursor, ObjectId } from "mongodb";
import { IMonetaryAmount } from "../models/MonetaryAmount";
import { IPackage, IPackageCreator, IPackageEntity, IPackageFilters, IPackageModifier } from "../models/Package";
import { IPackageService } from "../models/PackageService";
import { Validator } from "../models/Validator";
import { BaseMongoService } from "./BaseMongoService";

@injectable()
export class MongoPackageService
  extends BaseMongoService<IPackageEntity, IPackage, IPackageFilters, IPackageCreator, IPackageModifier>
  implements IPackageService {
  public static collectionName = "packages";

  public creatorValidator: Validator<IPackageCreator> = {};

  public getDefaultFilters(): IPackageFilters {
    return { onlyActive: true, ids: undefined, isCustom: false };
  }

  public getFilteredQuery({ onlyActive, ids, isCustom }: IPackageFilters): Cursor<IPackageEntity> {
    const filters = [
      onlyActive !== undefined ? { isActive: onlyActive } : undefined,
      isCustom !== undefined ? { isCustom } : undefined,
      ids !== undefined ? { _id: { $in: ids.map(id => new ObjectId(id)) } } : undefined
    ].filter(el => el !== undefined);

    return this.collection.find({
      $and: filters
    });
  }

  public async createEntity(creator: IPackageCreator): Promise<IPackageEntity> {
    const fromSuper = await super.createEntity(creator);
    return {
      ...fromSuper,
      ...creator,
      tags: fromSuper.tags || []
    };
  }

  public toModel(entity: IPackageEntity): IPackage {
    return {
      id: entity._id.toString(),
      createdAt: entity.createdAt,
      defaultTag: entity.defaultTag,
      image: entity.image,
      isActive: entity.isActive,
      price: entity.price,
      isCustomizable: entity.isCustomizable,
      isCustom: entity.isCustom,
      priority: entity.priority,
      reference: entity.reference,
      repeatConfig: entity.repeatConfig,
      tags: entity.tags,
      updatedAt: entity.updatedAt
    };
  }

  public isCustomPrice(originalPrice: IMonetaryAmount, price: IMonetaryAmount) {
    return originalPrice.amount === price.amount && originalPrice.currency === price.currency;
  }
}
