import { ContainerModule } from "inversify";
import "reflect-metadata";
import { IPackageService } from "./models/PackageService";
import { ContextProvider, IContextProvider } from "./schema/context";
import { MongoPackageService } from "./services/MongoPackageService";
import { TYPES } from "./types";

const production = new ContainerModule(bind => {
  bind<IPackageService>(TYPES.IPackageService)
    .to(MongoPackageService)
    .inSingletonScope();
  bind<IContextProvider>(TYPES.IContextProvider)
    .to(ContextProvider)
    .inRequestScope();
});

const test = new ContainerModule(bind => {
  bind<IPackageService>(TYPES.IPackageService)
    .to(MongoPackageService)
    .inSingletonScope();
  bind<IContextProvider>(TYPES.IContextProvider)
    .to(ContextProvider)
    .inRequestScope();
});

export { production, test };

