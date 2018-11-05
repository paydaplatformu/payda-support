import { inject, injectable } from "inversify";
import "reflect-metadata";
import { IPackageService } from "../models/PackageService";
import { TYPES } from "../types";

export const Type = Symbol.for("IContextProvider");

export interface IContextProvider {
  packageService: IPackageService;
}

export interface IContext {
  packageService: IPackageService;
}

@injectable()
export class ContextProvider implements IContextProvider {
  @inject(TYPES.IPackageService)
  public packageService: IPackageService = null as any;
}
