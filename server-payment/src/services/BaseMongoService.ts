import { inject, injectable } from "inversify";
import { Collection, Db } from "mongodb";
import { TYPES } from "../types";

@injectable()
export abstract class BaseMongoService<T> {
  public static collectionName: string;

  public collection: Collection<T>;

  constructor(@inject(TYPES.IMongoDb) db: Db = null as any) {
    this.collection = db.collection((this.constructor as any).collectionName);
  }
}
