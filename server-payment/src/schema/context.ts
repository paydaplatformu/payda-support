import { inject, injectable } from "inversify";
import { Client } from "oauth2-server";
import "reflect-metadata";
import { DonationManagerService } from "../services/donation-manager/DonationManagerService";
import { DonationService } from "../services/donation/DonationService";
import { PackageService } from "../services/package/PackageService";
import { PayuService } from "../services/payu/PayuService";
import { SubscriptionService } from "../services/subscription/SubscriptionService";
import { UserModel } from "../models/User";
import { UserService } from "../services/user/UserService";
import { TYPES } from "../types";
import { SubscriptionManagerService } from "../services/subscription-manager/SubscriptionManagerService";

export const Type = Symbol.for("IContextProvider");

export interface IContextProvider {
  packageService: PackageService;
  donationService: DonationService;
  subscriptionService: SubscriptionService;
  userService: UserService;
  payuService: PayuService;
  donationManagerService: DonationManagerService;
  subscriptionManagerService: SubscriptionManagerService;
}

export interface IContext {
  packageService: PackageService;
  donationService: DonationService;
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

  @inject(TYPES.DonationService)
  public donationService: DonationService = null as any;

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
