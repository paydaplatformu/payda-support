import { inject, injectable } from "inversify";
import "reflect-metadata";
import { IDonationService } from "../models/DonationService";
import { IPackageService } from "../models/PackageService";
import { TYPES } from "../types";

export const Type = Symbol.for("IContextProvider");

export interface IContextProvider {
  packageService: IPackageService;
  donationService: IDonationService;
}

export interface IContext {
  packageService: IPackageService;
  donationService: IDonationService;
}

@injectable()
export class ContextProvider implements IContextProvider {
  @inject(TYPES.IPackageService)
  public packageService: IPackageService = null as any;

  @inject(TYPES.IDonationService)
  public donationService: IDonationService = null as any;
}
