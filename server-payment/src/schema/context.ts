import { inject, injectable } from "inversify";
import { Client } from "oauth2-server";
import "reflect-metadata";
import { DonationManagerService } from "../services/donation-manager/DonationManagerService";
import { DonationService } from "../services/donation/DonationService";
import { PackageService } from "../services/package/PackageService";
import { SubscriptionService } from "../services/subscription/SubscriptionService";
import { UserModel } from "../models/User";
import { UserService } from "../services/user/UserService";
import { TYPES } from "../types";
import { SubscriptionManagerService } from "../services/subscription-manager/SubscriptionManagerService";
import { IyzicoService } from "../services/iyzico/IyzicoService";

export const Type = Symbol.for("IContextProvider");

export interface IContextProvider {
  packageService: PackageService;
  donationService: DonationService;
  subscriptionService: SubscriptionService;
  userService: UserService;
  donationManagerService: DonationManagerService;
  subscriptionManagerService: SubscriptionManagerService;
}

export interface IContext {
  packageService: PackageService;
  donationService: DonationService;
  subscriptionService: SubscriptionService;
  userService: UserService;
  donationManagerService: DonationManagerService;
  subscriptionManagerService: SubscriptionManagerService;
  iyzicoService: IyzicoService;
  user: UserModel;
  client: Client;
  scope?: string;
  ip: string;
}

@injectable()
export class ContextProvider implements IContextProvider {
  @inject(TYPES.PackageService)
  public packageService: PackageService = null as never;

  @inject(TYPES.DonationService)
  public donationService: DonationService = null as never;

  @inject(TYPES.SubscriptionService)
  public subscriptionService: SubscriptionService = null as never;

  @inject(TYPES.UserService)
  public userService: UserService = null as never;

  @inject(TYPES.DonationManagerService)
  public donationManagerService: DonationManagerService = null as never;

  @inject(TYPES.SubscriptionManagerService)
  public subscriptionManagerService: SubscriptionManagerService = null as never;

  @inject(TYPES.IyzicoService)
  public iyzicoService: IyzicoService = null as never;
}
