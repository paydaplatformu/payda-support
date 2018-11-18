import { ContainerModule } from "inversify";
import "reflect-metadata";
import { IAuthentication } from "./models/Authentication";
import { IDonationService } from "./models/DonationService";
import { IUserService } from "./models/IUserService";
import { IPackageService } from "./models/PackageService";
import { ContextProvider, IContextProvider } from "./schema/context";
import { JwtAuthentication } from "./services/JwtAuthentication";
import { MockDonationService } from "./services/MockDonationService";
import { MockPackageService } from "./services/MockPackageService";
import { MockUserService } from "./services/MockUserService";
import { TYPES } from "./types";

const production = new ContainerModule(bind => {
  bind<IAuthentication>(TYPES.IAuthentication)
    .to(JwtAuthentication)
    .inSingletonScope();
  bind<IUserService>(TYPES.IUserService)
    .to(MockUserService)
    .inSingletonScope();
  bind<IPackageService>(TYPES.IPackageService)
    .to(MockPackageService)
    .inSingletonScope();
  bind<IDonationService>(TYPES.IDonationService)
    .to(MockDonationService)
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
  bind<IDonationService>(TYPES.IDonationService)
    .to(MockDonationService)
    .inSingletonScope();
  bind<IContextProvider>(TYPES.IContextProvider)
    .to(ContextProvider)
    .inRequestScope();
});

export { production, test };

