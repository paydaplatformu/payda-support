import { inject, injectable } from "inversify";
import { Client } from "oauth2-server";
import "reflect-metadata";
import { IDonationService } from "../models/DonationService";
import { IUserService } from "../models/IUserService";
import { IPackageService } from "../models/PackageService";
import { IUser } from "../models/User";
import { TYPES } from "../types";

export const Type = Symbol.for("IContextProvider");

export interface IContextProvider {
  packageService: IPackageService;
  donationService: IDonationService;
  userService: IUserService;
}

export interface IContext {
  packageService: IPackageService;
  donationService: IDonationService;
  userService: IUserService;
  user: IUser;
  client: Client;
  scope?: string;
}

@injectable()
export class ContextProvider implements IContextProvider {
  @inject(TYPES.IPackageService)
  public packageService: IPackageService = null as any;

  @inject(TYPES.IDonationService)
  public donationService: IDonationService = null as any;

  @inject(TYPES.IUserService)
  public userService: IUserService = null as any;
}
