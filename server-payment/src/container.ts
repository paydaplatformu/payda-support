import { ContainerModule } from "inversify";
import "reflect-metadata";
import { IDonationService } from "./models/DonationService";
import { IPackageService } from "./models/PackageService";
import { ContextProvider, IContextProvider } from "./schema/context";
import { MockDonationService } from "./services/MockDonationService";
import { MockPackageService } from "./services/MockPackageService";
import { TYPES } from "./types";

const production = new ContainerModule(bind => {
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

