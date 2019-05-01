import { injectable } from "inversify";
import { ObjectId } from "mongodb";
import { MonetaryAmount } from "../models/MonetaryAmount";
import { PackageModel, PackageCreator, PackageEntity, PackageFilters, PackageModifier } from "../models/Package";
import { PackageService } from "../models/PackageService";
import { RepeatInterval } from "../models/RepeatInterval";
import { Validator } from "../models/Validator";
import { BaseMongoService } from "./BaseMongoService";

@injectable()
export class MongoPackageService
  extends BaseMongoService<PackageEntity, PackageModel, PackageFilters, PackageCreator, PackageModifier>
  implements PackageService {
  protected static collectionName = "packages";

  protected async initiate(): Promise<void> {
    const hasSearchIndex = await this.collection.indexExists("search");
    if (!hasSearchIndex) {
      await this.collection.createIndex({ "defaultTag.name": "text", reference: "text" }, { name: "search" });
    }
  }

  protected async createEntity(creator: PackageCreator): Promise<PackageEntity> {
    const fromSuper = await super.createEntity(creator);
    return {
      ...fromSuper,
      ...creator,
      tags: fromSuper.tags || []
    };
  }
  protected creatorValidator: Validator<PackageCreator> = {};

  protected getFilters = ({
    onlyActive,
    ids,
    showCustom,
    repeatInterval,
    amount,
    currency,
    search
  }: PackageFilters): object[] => {
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

  protected toModel = (entity: PackageEntity): PackageModel => {
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

  public getByRepeatInterval = (repeatInterval: RepeatInterval): Promise<PackageModel[]> => {
    return this.getAll({ repeatInterval });
  };

  public getDefaultFilters = (): PackageFilters => {
    return { onlyActive: true, ids: undefined, showCustom: false };
  };
}
