import { injectable } from "inversify";
import { IPackageService } from "../models/PackageService";

@injectable()
export class MongoPackageService implements IPackageService {
  public getAll = () => [{ name: "asdffaerf" }];
}
