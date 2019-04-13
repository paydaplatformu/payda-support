import { ContainerModule } from "inversify";
import "reflect-metadata";
import { IAuthentication } from "./models/Authentication";
import { IDonationManagerService } from "./models/DonationManagerService";
import { IDonationService } from "./models/DonationService";
import { IPackageService } from "./models/PackageService";
import { IPayuService } from "./models/PayuService";
import { ISubscriptionManagerService } from "./models/SubscriptionManagerService";
import { ISubscriptionService } from "./models/SubscriptionService";
import { IUserService } from "./models/UserService";
import { ContextProvider, IContextProvider } from "./schema/context";
import { DonationManagerService } from "./services/DonationManagerService";
import { JwtAuthentication } from "./services/JwtAuthentication";
import { MongoDbConnectionProvider } from "./services/MongoDbConnectionProvider";
import { MongoDonationService } from "./services/MongoDonationService";
import { MongoPackageService } from "./services/MongoPackageService";
import { MongoSubscriptionService } from "./services/MongoSubscriptionService";
import { MongoUserService } from "./services/MongoUserService";
import { PayuService } from "./services/PayuService";
import { SubscriptionManagerService } from "./services/SubscriptionManagerService";
import { TYPES } from "./types";

const production = new ContainerModule(bind => {
  bind<MongoDbConnectionProvider>(MongoDbConnectionProvider)
    .toSelf()
    .inSingletonScope();
  bind<IAuthentication>(TYPES.IAuthentication)
    .to(JwtAuthentication)
    .inSingletonScope();
  bind<IUserService>(TYPES.IUserService)
    .to(MongoUserService)
    .inSingletonScope();
  bind<IPackageService>(TYPES.IPackageService)
    .to(MongoPackageService)
    .inSingletonScope();
  bind<ISubscriptionService>(TYPES.ISubscriptionService)
    .to(MongoSubscriptionService)
    .inSingletonScope();
  bind<IDonationService>(TYPES.IDonationService)
    .to(MongoDonationService)
    .inSingletonScope();
  bind<IPayuService>(TYPES.IPayuService)
    .to(PayuService)
    .inSingletonScope();
  bind<ISubscriptionManagerService>(TYPES.ISubscriptionManagerService)
    .to(SubscriptionManagerService)
    .inSingletonScope();
  bind<IDonationManagerService>(TYPES.IDonationManagerService)
    .to(DonationManagerService)
    .inSingletonScope();
  bind<IContextProvider>(TYPES.IContextProvider)
    .to(ContextProvider)
    .inRequestScope();
});

const test = new ContainerModule(bind => {
  bind<IAuthentication>(TYPES.IAuthentication)
    .to(JwtAuthentication)
    .inSingletonScope();
  bind<IUserService>(TYPES.IUserService)
    .to(MongoUserService)
    .inSingletonScope();
  bind<IPackageService>(TYPES.IPackageService)
    .to(MongoPackageService)
    .inSingletonScope();
  bind<ISubscriptionService>(TYPES.ISubscriptionService)
    .to(MongoSubscriptionService)
    .inSingletonScope();
  bind<IDonationService>(TYPES.IDonationService)
    .to(MongoDonationService)
    .inSingletonScope();
  bind<IPayuService>(TYPES.IPayuService)
    .to(PayuService)
    .inSingletonScope();
  bind<IDonationManagerService>(TYPES.IDonationManagerService)
    .to(DonationManagerService)
    .inSingletonScope();
  bind<ISubscriptionManagerService>(TYPES.ISubscriptionManagerService)
    .to(SubscriptionManagerService)
    .inSingletonScope();
  bind<IContextProvider>(TYPES.IContextProvider)
    .to(ContextProvider)
    .inRequestScope();
});

export { production, test };
