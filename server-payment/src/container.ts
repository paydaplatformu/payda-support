import { ContainerModule } from "inversify";
import "reflect-metadata";
import { Authentication } from "./models/Authentication";
import { DonationManagerService } from "./services/donation-manager/DonationManagerService";
import { DonationService } from "./services/donation/DonationService";
import { PackageService } from "./services/package/PackageService";
import { PayuService } from "./services/payu/PayuService";
import { SubscriptionManagerService } from "./services/subscription-manager/SubscriptionManagerService";
import { SubscriptionService } from "./services/subscription/SubscriptionService";
import { UserService } from "./services/user/UserService";
import { ContextProvider, IContextProvider } from "./schema/context";
import { DonationManagerServiceImpl } from "./services/donation-manager/DonationManagerServiceImpl";
import { JwtAuthentication } from "./services/JwtAuthentication";
import { MongoDbConnectionProvider } from "./services/MongoDbConnectionProvider";
import { MongoDonationService } from "./services/donation/MongoDonationService";
import { MongoPackageService } from "./services/package/MongoPackageService";
import { MongoSubscriptionService } from "./services/subscription/MongoSubscriptionService";
import { MongoUserService } from "./services/user/MongoUserService";
import { PayuServiceImpl } from "./services/payu/PayuServiceImpl";
import { SubscriptionManagerServiceImpl } from "./services/subscription-manager/SubscriptionManagerServiceImpl";
import { TYPES } from "./types";

const production = new ContainerModule(bind => {
  bind<MongoDbConnectionProvider>(MongoDbConnectionProvider)
    .toSelf()
    .inSingletonScope();
  bind<Authentication>(TYPES.Authentication)
    .to(JwtAuthentication)
    .inSingletonScope();
  bind<UserService>(TYPES.UserService)
    .to(MongoUserService)
    .inSingletonScope();
  bind<PackageService>(TYPES.PackageService)
    .to(MongoPackageService)
    .inSingletonScope();
  bind<SubscriptionService>(TYPES.SubscriptionService)
    .to(MongoSubscriptionService)
    .inSingletonScope();
  bind<DonationService>(TYPES.DonationService)
    .to(MongoDonationService)
    .inSingletonScope();
  bind<PayuService>(TYPES.PayuService)
    .to(PayuServiceImpl)
    .inSingletonScope();
  bind<SubscriptionManagerService>(TYPES.SubscriptionManagerService)
    .to(SubscriptionManagerServiceImpl)
    .inSingletonScope();
  bind<DonationManagerService>(TYPES.DonationManagerService)
    .to(DonationManagerServiceImpl)
    .inSingletonScope();
  bind<IContextProvider>(TYPES.IContextProvider)
    .to(ContextProvider)
    .inRequestScope();
});

const test = new ContainerModule(bind => {
  bind<Authentication>(TYPES.Authentication)
    .to(JwtAuthentication)
    .inSingletonScope();
  bind<UserService>(TYPES.UserService)
    .to(MongoUserService)
    .inSingletonScope();
  bind<PackageService>(TYPES.PackageService)
    .to(MongoPackageService)
    .inSingletonScope();
  bind<SubscriptionService>(TYPES.SubscriptionService)
    .to(MongoSubscriptionService)
    .inSingletonScope();
  bind<DonationService>(TYPES.DonationService)
    .to(MongoDonationService)
    .inSingletonScope();
  bind<PayuService>(TYPES.PayuService)
    .to(PayuServiceImpl)
    .inSingletonScope();
  bind<DonationManagerService>(TYPES.DonationManagerService)
    .to(DonationManagerServiceImpl)
    .inSingletonScope();
  bind<SubscriptionManagerService>(TYPES.SubscriptionManagerService)
    .to(SubscriptionManagerServiceImpl)
    .inSingletonScope();
  bind<IContextProvider>(TYPES.IContextProvider)
    .to(ContextProvider)
    .inRequestScope();
});

export { production, test };
