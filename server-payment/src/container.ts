import { ContainerModule } from "inversify";
import "reflect-metadata";
import { IAuthentication } from "./models/Authentication";
import { IDonationService } from "./models/DonationService";
import { IPackageService } from "./models/PackageService";
import { IPayuService } from "./models/PayuService";
import { IUserService } from "./models/UserService";
import { ContextProvider, IContextProvider } from "./schema/context";
import { JwtAuthentication } from "./services/JwtAuthentication";
import { MockDonationService } from "./services/MockDonationService";
import { MockPackageService } from "./services/MockPackageService";
import { MockUserService } from "./services/MockUserService";
import { MongoDbConnectionProvider } from "./services/MongoDbConnectionProvider";
import { MongoDonationService } from "./services/MongoDonationService";
import { MongoPackageService } from "./services/MongoPackageService";
import { MongoUserService } from "./services/MongoUserService";
import { PayuService } from "./services/PayuService";
import { TYPES } from "./types";
import { ISubscriptionService } from "./models/SubscriptionService";
import { MongoSubscriptionService } from "./services/MongoSubscriptionService";
import { MockSubscriptionService } from "./services/MockSubscriptionService";

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
  bind<IContextProvider>(TYPES.IContextProvider)
    .to(ContextProvider)
    .inRequestScope();
});

const test = new ContainerModule(bind => {
  bind<IAuthentication>(TYPES.IAuthentication)
    .to(JwtAuthentication)
    .inSingletonScope();
  bind<IUserService>(TYPES.IUserService)
    .to(MockUserService)
    .inSingletonScope();
  bind<IPackageService>(TYPES.IPackageService)
    .to(MockPackageService)
    .inSingletonScope();
  bind<ISubscriptionService>(TYPES.ISubscriptionService)
    .to(MockSubscriptionService)
    .inSingletonScope();
  bind<IDonationService>(TYPES.IDonationService)
    .to(MockDonationService)
    .inSingletonScope();
  bind<IPayuService>(TYPES.IPayuService)
    .to(PayuService)
    .inSingletonScope();
  bind<IContextProvider>(TYPES.IContextProvider)
    .to(ContextProvider)
    .inRequestScope();
});

export { production, test };

