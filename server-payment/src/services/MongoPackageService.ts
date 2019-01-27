import { ObjectID } from "bson";
import { injectable } from "inversify";
import { IPackage, IPackageCreator, IPackageEntity, IPackageModifier } from "../models/Package";
import { IPackageFilters } from "../models/PackageFilters";
import { IPackageService } from "../models/PackageService";
import { BaseMongoService } from "./BaseMongoService";

@injectable()
export class MongoPackageService extends BaseMongoService<IPackageEntity> implements IPackageService {
  public static collectionName = "packages";

  private async getEntityById(id: string): Promise<IPackageEntity | null> {
    return this.collection.findOne({ _id: new ObjectID(id) });
  }

  public async getById(id: string): Promise<IPackage | null> {
    const result = await this.getEntityById(id);
    if (result) {
      return this.toModel(result);
    }
    return null;
  }

  public async create(packageCreator: IPackageCreator): Promise<IPackage> {
    const mongoInput = {
      _id: new ObjectID(),
      defaultTag: packageCreator.defaultTag,
      price: packageCreator.price,
      priority: packageCreator.priority,
      repeatConfig: packageCreator.repeatConfig,
      tags: packageCreator.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    const result = await this.collection.insert(mongoInput);

    const newPackage: IPackageEntity = {
      _id: result.insertedId,
      ...mongoInput
    };

    return this.toModel(newPackage);
  }
  public async edit(packageModifier: IPackageModifier) {
    const current = await this.getEntityById(packageModifier.id);
    if (!current) return null;
    const next: IPackageEntity = {
      ...current,
      ...packageModifier
    };
    await this.collection.updateOne({ _id: current._id }, { $set: next });
    return this.toModel(next);
  }

  public activate(id: string): Promise<string | null> {
    throw new Error("Method not implemented.");
  }
  public deactivate(id: string): Promise<string | null> {
    throw new Error("Method not implemented.");
  }

  public getAll = async ({ onlyActive }: IPackageFilters) => {
    if (onlyActive) {
      const actives = await this.collection.find({ isActive: true }).toArray();
      return actives.map(this.toModel);
    }
    const all = await this.collection.find().toArray();
    return all.map(this.toModel);
  };

  private toModel(entity: IPackageEntity): IPackage {
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
