import { injectable } from "inversify";
import { ObjectId } from "mongodb";
import { IMonetaryAmount } from "../models/MonetaryAmount";
import { IPackage, IPackageCreator, IPackageEntity, IPackageFilters, IPackageModifier } from "../models/Package";
import { IPackageService } from "../models/PackageService";
import { RepeatInterval } from "../models/RepeatInterval";
import { Validator } from "../models/Validator";
import { BaseMongoService } from "./BaseMongoService";

@injectable()
export class MongoPackageService
  extends BaseMongoService<IPackageEntity, IPackage, IPackageFilters, IPackageCreator, IPackageModifier>
  implements IPackageService {
  protected static collectionName = "packages";

  protected async initiate(): Promise<void> {
    const hasSearchIndex = await this.collection.indexExists("search");
    if (!hasSearchIndex) {
      await this.collection.createIndex({ "defaultTag.name": "text", reference: "text" }, { name: "search" });
    }
  }

  protected async createEntity(creator: IPackageCreator): Promise<IPackageEntity> {
    const fromSuper = await super.createEntity(creator);
    return {
      ...fromSuper,
      ...creator,
      tags: fromSuper.tags || []
    };
  }
  protected creatorValidator: Validator<IPackageCreator> = {};

  protected getFilters = ({
    onlyActive,
    ids,
    showCustom,
    repeatInterval,
    amount,
    currency,
    search
  }: IPackageFilters): object[] => {
    return [
      onlyActive === true ? { isActive: true } : undefined,
      showCustom !== true ? { isCustom: false } : undefined,
      ids !== undefined ? { _id: { $in: ids.map(id => new ObjectId(id)) } } : undefined,
      repeatInterval !== undefined ? { repeatInterval } : undefined,
      amount !== undefined ? { "price.amount": amount } : undefined,
      currency !== undefined ? { "price.currency": currency } : undefined,
      search !== undefined ? { $text: { $search: search } } : undefined
    ].filter(el => el !== undefined) as any;
  };

  protected toModel = (entity: IPackageEntity): IPackage => {
    return {
      id: entity._id.toString(),
      createdAt: entity.createdAt,
      defaultTag: entity.defaultTag,
      image: entity.image,
      isActive: entity.isActive,
      price: entity.price,
      customizationConfig: entity.customizationConfig,
      isCustom: entity.isCustom,
      priority: entity.priority,
      reference: entity.reference,
      repeatInterval: entity.repeatInterval,
      tags: entity.tags,
      updatedAt: entity.updatedAt
    };
  };

  public getByRepeatInterval = (repeatInterval: RepeatInterval): Promise<IPackage[]> => {
    return this.getAll({ repeatInterval });
  };

  public getDefaultFilters = (): IPackageFilters => {
    return { onlyActive: true, ids: undefined, showCustom: false };
  };
}
