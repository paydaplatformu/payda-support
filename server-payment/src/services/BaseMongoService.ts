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
  public static collectionName: string;

  public collection: Collection<Entity>;

  constructor(@inject(TYPES.IMongoDb) db: Db = null as any) {
    super();
    this.collection = db.collection((this.constructor as any).collectionName);
  }

  public paginate(cursor: Cursor<Entity>, pagination: PaginationSettings) {
    const perPage = pagination.perPage || 10;
    const page = pagination.page || 0;
    return cursor.skip(perPage * page).limit(perPage);
  }

  public sort(cursor: Cursor<Entity>, sorting: SortingSettings) {
    const field = sorting.sortField === "id" ? "_id" : sorting.sortField;
    const order = sorting.sortOrder === "ASC" ? 1 : -1;
    return cursor.sort({ [field]: order });
  }

  public abstract toModel(entity: Entity): Model;

  public abstract getFilteredQuery(filters: Filters): Cursor<Entity>;

  public getAll = async (filters: Filters, pagination: PaginationSettings, sorting: SortingSettings) => {
    const query = this.getFilteredQuery(filters);
    const sorted = this.sort(query, sorting);
    const paginated = this.paginate(sorted, pagination);
    const results = await paginated.toArray();
    return results.map(this.toModel);
  };

  public count = (filters: Filters) => {
    const query = this.getFilteredQuery(filters);
    return query.count();
  };

  private async getEntityById(id: string): Promise<Entity | null> {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  public async getById(id: string): Promise<Model | null> {
    const result = await this.getEntityById(id);
    if (result) {
      return this.toModel(result);
    }
    return null;
  }

  public async edit(modifier: Modifier) {
    const current = await this.getEntityById(modifier.id);
    if (!current) return null;
    const next: Entity = {
      ...current,
      ...modifier
    };
    await this.collection.updateOne({ _id: current._id }, { $set: next });
    return this.toModel(next);
  }

  public generateCommonFields() {
    return {
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
  }

  public async createEntity(creator: Creator): Promise<Entity> {
    return ({
      ...creator,
      ...this.generateCommonFields()
    } as any) as Entity;
  }

  public async create(creator: Creator): Promise<Model> {
    const mongoInput: Entity = await this.createEntity(creator);
    const result = await this.collection.insertOne(mongoInput);

    const newPackage: Entity = {
      _id: result.insertedId,
      ...mongoInput
    };

    return this.toModel(newPackage);
  }
}
