import { inject, injectable } from "inversify";
import { Collection, Cursor, Db, ObjectId } from "mongodb";
import { BaseEntityService } from "../models/BaseEntityService";
import { IModifier } from "../models/Modifier";
import { MongoEntity } from "../models/MongoEntity";
import { PaginationSettings } from "../models/PaginationSettings";
import { SortingSettings } from "../models/SortingSettings";
import { TYPES } from "../types";

@injectable()
export abstract class BaseMongoService<
  Entity extends MongoEntity,
  Model,
  Filters,
  Creator,
  Modifier extends IModifier
> extends BaseEntityService<Creator> {
  protected static collectionName: string;

  protected collection: Collection<Entity>;

  protected async createEntity(creator: Creator): Promise<Entity> {
    return ({
      ...creator,
      ...this.generateCommonFields()
    } as any) as Entity;
  }

  protected generateCommonFields = () => {
    return {
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
  };

  protected getEntityById = async (id: string): Promise<Entity | null> => {
    return this.collection.findOne({ _id: new ObjectId(id) });
  };

  protected abstract getFilters: (filters: Filters) => object[];

  protected paginate = (cursor: Cursor<Entity>, pagination: PaginationSettings) => {
    const perPage = pagination.perPage || 10;
    const page = pagination.page || 0;
    return cursor.skip(perPage * page).limit(perPage);
  };

  protected prepareQuery = (
    filters: Filters,
    pagination?: PaginationSettings,
    sorting?: SortingSettings,
    extraFilters?: object[]
  ): Cursor<Entity> => {
    const filterArray = this.getFilters(filters);
    const combinedFilterArray = extraFilters ? [...filterArray, ...extraFilters] : filterArray;
    const filteredQuery =
      combinedFilterArray.length > 0 ? this.collection.find({ $and: combinedFilterArray }) : this.collection.find();
    const sorted = sorting ? this.sort(filteredQuery, sorting) : filteredQuery;
    const paginated = pagination ? this.paginate(sorted, pagination) : sorted;
    return paginated;
  };

  protected countQuery = (cursor: Cursor<Entity>): Promise<number> => {
    return cursor.count();
  };

  protected executeQuery = async (cursor: Cursor<Entity>): Promise<Model[]> => {
    const results = await cursor.toArray();
    return results.map(this.toModel);
  };

  protected sort = (cursor: Cursor<Entity>, sorting: SortingSettings) => {
    const field = sorting.sortField === "id" ? "_id" : sorting.sortField;
    const order = sorting.sortOrder === "ASC" ? 1 : -1;
    return cursor.sort({ [field]: order });
  };

  protected abstract toModel: (entity: Entity) => Model;

  public count = (filters: Filters, extraFilters?: object[]): Promise<number> => {
    const query = this.prepareQuery(filters, undefined, undefined, extraFilters);
    return this.countQuery(query);
  };

  public create = async (creator: Creator): Promise<Model> => {
    const mongoInput: Entity = await this.createEntity(creator);
    const result = await this.collection.insertOne(mongoInput);

    const newPackage: Entity = {
      _id: result.insertedId,
      ...mongoInput
    };

    return this.toModel(newPackage);
  };

  public edit = async (modifier: Modifier) => {
    const current = await this.getEntityById(modifier.id);
    if (!current) return null;
    const next: Entity = {
      ...current,
      ...modifier
    };
    await this.collection.updateOne({ _id: current._id }, { $set: next });
    return this.toModel(next);
  };

  public getAll = async (
    filters: Filters,
    pagination?: PaginationSettings,
    sorting?: SortingSettings,
    extraFilters?: object[]
  ): Promise<Model[]> => {
    const query = this.prepareQuery(filters, pagination, sorting, extraFilters);
    return this.executeQuery(query);
  };

  public getById = async (id: string): Promise<Model | null> => {
    const result = await this.getEntityById(id);
    if (result) {
      return this.toModel(result);
    }
    return null;
  };

  constructor(@inject(TYPES.IMongoDb) db: Db = null as any) {
    super();
    this.collection = db.collection((this.constructor as any).collectionName);
  }
}
