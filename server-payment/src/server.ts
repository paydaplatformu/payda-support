import { ContextFunction } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import * as bodyParser from "body-parser";
import express, { Express } from "express";
import "express-async-errors";
import { Container } from "inversify";
import { config } from "./config";
import { production, test } from "./container";
import { errorHandler } from "./middleware/errorHandler";
import { resolvers, typeDefs } from "./schema";
import { IContextProvider } from "./schema/context";
import { TYPES } from "./types";
import chalk from "chalk";

const log = console.log; // tslint:disable-line

type Environment = "production" | "development" | "test";

const getProfile = (environment: Environment) => {
  if (environment === "test") {
    return test;
  }
  return production;
};

export const createServer = (callback?: (error: any, app: Express) => any) => {
  const context: ContextFunction = async () => {
    const tools = container.get<IContextProvider>(TYPES.IContextProvider);
    return {
      ...tools
    };
  };

  const server = new ApolloServer({
    context,
    typeDefs,
    resolvers,
    formatError: (error: any) => {
      console.error(error);
      return error;
    }
  });

  const app: Express = express();

  app.use(bodyParser.json());

  server.applyMiddleware({ app }); // app is from an existing express app

  app.use(errorHandler);

  const port = config.get("port");
  const host = config.get("host");
  const environment: Environment = config.get("environment") as any;

  const container = new Container();
  const profile = getProfile(environment);
  container.load(profile);
  return app.listen(port, host, () => {
    log(
      `\n  ${chalk.gray("App is running at")} ${chalk.cyan("http://%s:%d")} ${chalk.gray("in")} ${chalk.blue(
        "%s"
      )} ${chalk.green("mode")}`,
      host,
      port,
      environment
    );
    log(`  ${chalk.gray("Graphql is running at")} ${chalk.cyan("http://%s:%d%s")}`, host, port, server.graphqlPath);
    log(`  ${chalk.gray("Press")} ${chalk.red("CTRL-C")} ${chalk.gray("to stop.\n")}`);
    if (callback) {
      callback(null, app);
    }
  });
};
