import { ContextFunction } from "apollo-server-core";
import retry from "async-retry";
import chalk from "chalk";
import { Container } from "inversify";
import { Db } from "mongodb";
import { config } from "../config";
import { IAuthentication } from "../models/Authentication";
import { IUserService } from "../models/UserService";
import { IContextProvider } from "../schema/context";
import { MongoDbConnectionProvider } from "../services/MongoDbConnectionProvider";
import { TYPES } from "../types";
import { createTokenGetter } from "./helpers";

export const bindMongoDb = async (container: Container, log: any) => {
  if (container.isBound(MongoDbConnectionProvider)) {
    const mongoDbConnectionProvider = container.get<MongoDbConnectionProvider>(MongoDbConnectionProvider);
    const db = await retry(async () => await mongoDbConnectionProvider.getConnection(), {
      retries: 100,
      onRetry: error => {
        log(error);
      }
    });
    container.bind<Db>(TYPES.IMongoDb).toConstantValue(db);
    log(chalk.green("\n  Database connected"));
  }
};

export const createAdminUser = async (userService: IUserService) => {
  const userCount = await userService.getUserCount();
  if (userCount === 0) {
    await userService.create({
      email: config.get("defaultUser.email"),
      password: config.get("defaultUser.password")
    });
  }
};

export const createGraphQLContext: (container: Container, model: IAuthentication) => ContextFunction = (
  container,
  model
) => async ({ req }) => {
  const getToken = createTokenGetter(model);
  const token = await getToken(req.get("Authorization"));

  const authorizationData = token
    ? {
        user: token.user,
        scope: token.scope,
        client: token.client
      }
    : {};

  const tools = container.get<IContextProvider>(TYPES.IContextProvider);
  return {
    ...tools,
    ...authorizationData
  };
};
