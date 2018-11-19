import { Db, MongoClient } from 'mongodb';
import { injectable } from 'inversify';
import { config } from '../config';

const databaseUrl = config.get("db.url")

@injectable()
export class MongoDbConnectionProvider {
  private isConnected: boolean = false;
  private db: Db | undefined = undefined;

  public async getConnection() {
    if (this.isConnected) return Promise.resolve(this.db);
    return this.connect()
  }

  private async connect() {
    const client = await MongoClient.connect(databaseUrl, { useNewUrlParser: true });
    this.db = client.db();
    this.isConnected = true;
    return this.db;
  }
}