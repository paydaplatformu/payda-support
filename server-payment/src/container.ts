import { ContainerModule } from "inversify";
import "reflect-metadata";
import { Authentication } from "./models/Authentication";
import { DonationManagerService } from "./services/donation-manager/DonationManagerService";
import { DonationService } from "./services/donation/DonationService";
import { PackageService } from "./services/package/PackageService";
import { UserService } from "./services/user/UserService";
import { ContextProvider, IContextProvider } from "./schema/context";
import { DonationManagerServiceImpl } from "./services/donation-manager/DonationManagerServiceImpl";
import { JwtAuthentication } from "./services/JwtAuthentication";
import { MongoDbConnectionProvider } from "./services/MongoDbConnectionProvider";
import { MongoDonationService } from "./services/donation/MongoDonationService";
import { MongoPackageService } from "./services/package/MongoPackageService";
import { MongoUserService } from "./services/user/MongoUserService";
import { TYPES } from "./types";
import { IyzicoService } from "./services/iyzico/IyzicoService";
import { IyzicoServiceImpl } from "./services/iyzico/IyzicoServiceImpl";

const production = new ContainerModule((bind) => {
  bind<MongoDbConnectionProvider>(MongoDbConnectionProvider).toSelf().inSingletonScope();
  bind<Authentication>(TYPES.Authentication).to(JwtAuthentication).inSingletonScope();
  bind<UserService>(TYPES.UserService).to(MongoUserService).inSingletonScope();
  bind<PackageService>(TYPES.PackageService).to(MongoPackageService).inSingletonScope();
  bind<DonationService>(TYPES.DonationService).to(MongoDonationService).inSingletonScope();
  bind<IyzicoService>(TYPES.IyzicoService).to(IyzicoServiceImpl).inSingletonScope();
  bind<DonationManagerService>(TYPES.DonationManagerService).to(DonationManagerServiceImpl).inSingletonScope();
  bind<IContextProvider>(TYPES.IContextProvider).to(ContextProvider).inRequestScope();
});

const test = new ContainerModule((bind) => {
  bind<Authentication>(TYPES.Authentication).to(JwtAuthentication).inSingletonScope();
  bind<UserService>(TYPES.UserService).to(MongoUserService).inSingletonScope();
  bind<PackageService>(TYPES.PackageService).to(MongoPackageService).inSingletonScope();
  bind<DonationService>(TYPES.DonationService).to(MongoDonationService).inSingletonScope();
  bind<IyzicoService>(TYPES.IyzicoService).to(IyzicoServiceImpl).inSingletonScope();
  bind<DonationManagerService>(TYPES.DonationManagerService).to(DonationManagerServiceImpl).inSingletonScope();
  bind<IContextProvider>(TYPES.IContextProvider).to(ContextProvider).inRequestScope();
});

export { production, test };
