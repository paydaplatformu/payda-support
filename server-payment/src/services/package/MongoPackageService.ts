import { injectable } from "inversify";
import { ObjectId, WithId } from "mongodb";
import { PackageCreator, PackageEntity, PackageModifier } from "../../models/Package";
import { PackageService } from "./PackageService";
import { Validator } from "../../models/Validator";
import { BaseMongoService } from "../BaseMongoService";
import { RepeatInterval, Package, PackageFilter } from "../../generated/graphql";
import { isDefined } from "../../utilities/helpers";

@injectable()
export class MongoPackageService
  extends BaseMongoService<PackageEntity, Package, PackageFilter, PackageCreator, PackageModifier>
  implements PackageService {
  protected static collectionName = "packages";

  protected async initiate(): Promise<void> {
    const hasSearchIndex = await this.collection.indexExists("package_search");
    if (!hasSearchIndex) {
      await this.collection.createIndex({ "defaultTag.name": "text", reference: "text" }, { name: "package_search" });
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

  protected getFilters = (filter: Partial<PackageFilter>): object[] => {
    const { onlyActive, ids, onlyOriginal, repeatInterval, amount, currency, search } = filter || {};
    return [
      onlyActive === true ? { isActive: true } : undefined,
      onlyOriginal === true ? { isCustom: false } : undefined,
      isDefined(ids) ? { _id: { $in: ids.map(id => new ObjectId(id)) } } : undefined,
      repeatInterval !== undefined ? { repeatInterval } : undefined,
      amount !== undefined ? { "price.amount": amount } : undefined,
      currency !== undefined ? { "price.currency": currency } : undefined,
      search !== undefined ? { $text: { $search: search } } : undefined
    ].filter(el => el !== undefined) as any;
  };

  protected toModel = (entity: WithId<PackageEntity>): Package => {
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
      updatedAt: entity.updatedAt,
      donationCount: 0 // TODO: fix this
    };
  };

  public getByRepeatInterval = (repeatInterval: RepeatInterval): Promise<Package[]> => {
    return this.getAll({ repeatInterval }, null, null, []);
  };

  public getDefaultFilters = (): Partial<PackageFilter> => {
    return { onlyActive: true, onlyOriginal: true };
  };
}
