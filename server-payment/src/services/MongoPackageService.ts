import { injectable } from "inversify";
import { IPackageService } from "../models/PackageService";

@injectable()
export class MongoPackageService {
  public getAll = async () => [{ name: "asdffaerf" }] as any;
}
