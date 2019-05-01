import { ContainerModule } from "inversify";
import "reflect-metadata";
import { Authentication } from "./models/Authentication";
import { DonationManagerService } from "./models/DonationManagerService";
import { IDonationService } from "./models/DonationService";
import { PackageService } from "./models/PackageService";
import { PayuService } from "./models/PayuService";
import { SubscriptionManagerService } from "./models/SubscriptionManagerService";
import { SubscriptionService } from "./models/SubscriptionService";
import { UserService } from "./models/UserService";
import { ContextProvider, IContextProvider } from "./schema/context";
import { DonationManagerServiceImpl } from "./services/DonationManagerServiceImpl";
import { JwtAuthentication } from "./services/JwtAuthentication";
import { MongoDbConnectionProvider } from "./services/MongoDbConnectionProvider";
import { MongoDonationService } from "./services/MongoDonationService";
import { MongoPackageService } from "./services/MongoPackageService";
import { MongoSubscriptionService } from "./services/MongoSubscriptionService";
import { MongoUserService } from "./services/MongoUserService";
import { PayuServiceImpl } from "./services/PayuServiceImpl";
import { SubscriptionManagerServiceImpl } from "./services/SubscriptionManagerServiceImpl";
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
  bind<IDonationService>(TYPES.IDonationService)
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
  bind<IDonationService>(TYPES.IDonationService)
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
