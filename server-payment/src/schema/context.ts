import { inject, injectable } from "inversify";
import { Client } from "oauth2-server";
import "reflect-metadata";
import { DonationManagerService } from "../models/DonationManagerService";
import { IDonationService } from "../models/DonationService";
import { PackageService } from "../models/PackageService";
import { PayuService } from "../models/PayuService";
import { SubscriptionService } from "../models/SubscriptionService";
import { UserModel } from "../models/User";
import { UserService } from "../models/UserService";
import { TYPES } from "../types";
import { SubscriptionManagerService } from "../models/SubscriptionManagerService";

export const Type = Symbol.for("IContextProvider");

export interface IContextProvider {
  packageService: PackageService;
  donationService: IDonationService;
  subscriptionService: SubscriptionService;
  userService: UserService;
  payuService: PayuService;
  donationManagerService: DonationManagerService;
  subscriptionManagerService: SubscriptionManagerService;
}

export interface IContext {
  packageService: PackageService;
  donationService: IDonationService;
  subscriptionService: SubscriptionService;
  userService: UserService;
  payuService: PayuService;
  donationManagerService: DonationManagerService;
  subscriptionManagerService: SubscriptionManagerService;
  user: UserModel;
  client: Client;
  scope?: string;
}

@injectable()
export class ContextProvider implements IContextProvider {
  @inject(TYPES.PackageService)
  public packageService: PackageService = null as any;

  @inject(TYPES.IDonationService)
  public donationService: IDonationService = null as any;

  @inject(TYPES.SubscriptionService)
  public subscriptionService: SubscriptionService = null as any;

  @inject(TYPES.UserService)
  public userService: UserService = null as any;

  @inject(TYPES.PayuService)
  public payuService: PayuService = null as any;

  @inject(TYPES.DonationManagerService)
  public donationManagerService: DonationManagerService = null as any;

  @inject(TYPES.SubscriptionManagerService)
  public subscriptionManagerService: SubscriptionManagerService = null as any;
}
