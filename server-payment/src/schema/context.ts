import { inject, injectable } from "inversify";
import { Client } from "oauth2-server";
import "reflect-metadata";
import { IDonationService } from "../models/DonationService";
import { IPackageService } from "../models/PackageService";
import { ISubscriptionService } from "../models/SubscriptionService";
import { IPayuService } from "../models/PayuService";
import { IUser } from "../models/User";
import { IUserService } from "../models/UserService";
import { TYPES } from "../types";

export const Type = Symbol.for("IContextProvider");

export interface IContextProvider {
  packageService: IPackageService;
  donationService: IDonationService;
  subscriptionService: ISubscriptionService;
  userService: IUserService;
  payuService: IPayuService;
}

export interface IContext {
  packageService: IPackageService;
  donationService: IDonationService;
  subscriptionService: ISubscriptionService;
  userService: IUserService;
  payuService: IPayuService;
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

  @inject(TYPES.ISubscriptionService)
  public subscriptionService: ISubscriptionService = null as any;

  @inject(TYPES.IUserService)
  public userService: IUserService = null as any;

  @inject(TYPES.IPayuService)
  public payuService: IPayuService = null as any;
}
