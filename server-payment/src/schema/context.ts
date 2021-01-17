import { inject, injectable } from "inversify";
import { Client } from "oauth2-server";
import "reflect-metadata";
import { DonationManagerService } from "../services/donation-manager/DonationManagerService";
import { DonationService } from "../services/donation/DonationService";
import { PackageService } from "../services/package/PackageService";
import { UserModel } from "../models/User";
import { UserService } from "../services/user/UserService";
import { TYPES } from "../types";
import { IyzicoService } from "../services/iyzico/IyzicoService";

export const Type = Symbol.for("IContextProvider");

export interface IContextProvider {
  packageService: PackageService;
  donationService: DonationService;
  userService: UserService;
  donationManagerService: DonationManagerService;
}

export interface IContext {
  packageService: PackageService;
  donationService: DonationService;
  userService: UserService;
  donationManagerService: DonationManagerService;
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

  @inject(TYPES.UserService)
  public userService: UserService = null as never;

  @inject(TYPES.DonationManagerService)
  public donationManagerService: DonationManagerService = null as never;

  @inject(TYPES.IyzicoService)
  public iyzicoService: IyzicoService = null as never;
}
