import { ContextFunction } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import * as bodyParser from "body-parser";
import chalk from "chalk";
import express, { Express } from "express";
import "express-async-errors";
import { Container } from "inversify";
import path from "path";
import { config } from "./config";
import { production, test } from "./container";
import { errorHandler } from "./middleware/errorHandler";
import { resolvers, typeDefs } from "./schema";
import { IContextProvider } from "./schema/context";
import { TYPES } from "./types";

const log = console.log; // tslint:disable-line

type Environment = "production" | "development" | "test";

const getProfile = (input: Environment) => {
  if (input === "test") {
    return test;
  }
  return production;
};

const port = config.get("port");
const host = config.get("host");
const environment: Environment = config.get("environment") as any;

const container = new Container();
const profile = getProfile(environment);
container.load(profile);

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
    introspection: true,
    formatError: (error: any) => {
      console.error(error);
      return error;
    }
  });

  const app: Express = express();

  app.use(bodyParser.json());
  server.applyMiddleware({ app });
  app.use(errorHandler);

  app.use(express.static(path.resolve(__dirname, "../frontend-dist")));
  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend-dist", "index.html"));
  });

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
