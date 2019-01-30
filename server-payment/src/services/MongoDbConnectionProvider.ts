import { injectable } from "inversify";
import { Db, MongoClient } from "mongodb";
import { config } from "../config";

const databaseUrl = config.get("db.url");

@injectable()
export class MongoDbConnectionProvider {
  private isConnected: boolean = false;
  private db: Db | undefined = undefined;

  public async getConnection(): Promise<Db> {
    if (this.isConnected && this.db) return Promise.resolve(this.db);
    return this.connect();
  }

  private async connect() {
    const client = await MongoClient.connect(databaseUrl, { useNewUrlParser: true });
    this.db = client.db();
    this.isConnected = true;
    return this.db;
  }
}
