import { inject, injectable } from "inversify";
import { Client } from "oauth2-server";
import "reflect-metadata";
import { IDonationManagerService } from "../models/DonationManagerService";
import { IDonationService } from "../models/DonationService";
import { IPackageService } from "../models/PackageService";
import { IPayuService } from "../models/PayuService";
import { ISubscriptionService } from "../models/SubscriptionService";
import { IUser } from "../models/User";
import { IUserService } from "../models/UserService";
import { TYPES } from "../types";
import { ISubscriptionManagerService } from "../models/SubscriptionManagerService";

export const Type = Symbol.for("IContextProvider");

export interface IContextProvider {
  packageService: IPackageService;
  donationService: IDonationService;
  subscriptionService: ISubscriptionService;
  userService: IUserService;
  payuService: IPayuService;
  donationManagerService: IDonationManagerService;
  subscriptionManagerService: ISubscriptionManagerService;
}

export interface IContext {
  packageService: IPackageService;
  donationService: IDonationService;
  subscriptionService: ISubscriptionService;
  userService: IUserService;
  payuService: IPayuService;
  donationManagerService: IDonationManagerService;
  subscriptionManagerService: ISubscriptionManagerService;
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

  @inject(TYPES.IDonationManagerService)
  public donationManagerService: IDonationManagerService = null as any;

  @inject(TYPES.ISubscriptionManagerService)
  public subscriptionManagerService: ISubscriptionManagerService = null as any;
}
