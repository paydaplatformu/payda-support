import { inject, injectable } from "inversify";
import { Collection, Cursor, Db, ObjectId } from "mongodb";
import { BaseEntityService } from "./BaseEntityService";
import { MongoEntity } from "../models/MongoEntity";
import { PaginationSettings } from "../models/PaginationSettings";
import { SortingSettings } from "../models/SortingSettings";
import { TYPES } from "../types";
import { isDefined } from "../utilities/helpers";

@injectable()
export abstract class BaseMongoService<
  Entity extends MongoEntity,
  Model,
  Filters,
  Creator,
  BaseModifier extends {}
> extends BaseEntityService<Creator> {
  protected static collectionName: string;

  protected collection: Collection<Entity>;

  protected initiate(): Promise<void> {
    return Promise.resolve();
  }

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
    // TODO: remove as any when typescript bug is solved
    return this.collection.findOne({ _id: new ObjectId(id) } as any);
  };

  protected abstract getFilters: (filters: Partial<Filters>) => object[];

  protected paginate = (cursor: Cursor<Entity>, pagination: PaginationSettings) => {
    const perPage = pagination.perPage || 10;
    const page = pagination.page || 0;
    return cursor.skip(perPage * page).limit(perPage);
  };

  protected prepareQuery = (
    filters: Partial<Filters>,
    pagination: PaginationSettings | null,
    sorting: SortingSettings | null,
    extraFilters?: object[]
  ): Cursor<Entity> => {
    const filterArray = this.getFilters(filters);
    const combinedFilterArray = extraFilters ? [...filterArray, ...extraFilters] : filterArray;

    // TODO: remove as any when typescript bug is solved
    const filteredQuery =
      combinedFilterArray.length > 0
        ? this.collection.find({ $and: combinedFilterArray } as any)
        : this.collection.find();
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
    return isDefined(field) ? cursor.sort({ [field]: order }) : cursor;
  };

  protected abstract toModel: (entity: Entity) => Model;

  public count = (filters: Partial<Filters>, extraFilters?: object[]): Promise<number> => {
    const query = this.prepareQuery(filters, null, null, extraFilters);
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

  public edit = async (id: string, modifier: Partial<BaseModifier>) => {
    const current = await this.getEntityById(id);
    if (!current) return null;
    const next: Entity = {
      ...current,
      ...modifier,
      updatedAt: new Date()
    };
    // TODO: remove as any when typescript bug is solved
    await this.collection.updateOne({ _id: current._id } as any, { $set: next });
    return this.toModel(next);
  };

  public getAll = async (
    filters: Partial<Filters>,
    pagination: PaginationSettings | null,
    sorting: SortingSettings | null,
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
