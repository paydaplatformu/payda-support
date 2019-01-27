import { ContextFunction } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import retry from "async-retry";
import * as bodyParser from "body-parser";
import chalk from "chalk";
import express, { Express } from "express";
import "express-async-errors";
import { Container } from "inversify";
import { Db } from "mongodb";
import OAuthServer, { Request, Response, Token } from "oauth2-server";
import path from "path";
import { config } from "./config";
import { production, test } from "./container";
import { errorHandler } from "./middleware/errorHandler";
import { IAuthentication } from "./models/Authentication";
import { InvalidInput, ValidationError } from "./models/Errors";
import { IUserService } from "./models/UserService";
import { resolvers, typeDefs } from "./schema";
import { IContextProvider } from "./schema/context";
import { MongoDbConnectionProvider } from "./services/MongoDbConnectionProvider";
import { TYPES } from "./types";

const log = console.log; // tslint:disable-line

type Environment = "production" | "staging" | "development" | "test";

const getProfile = (input: Environment) => {
  if (["test", "development"].includes(input)) {
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

const getToken = (authenticationModel: IAuthentication) => async (
  header: string | undefined
): Promise<Token | null> => {
  if (header) {
    try {
      const token = await authenticationModel.getAccessToken(header.replace("Bearer ", ""));
      return token || null;
    } catch {
      return null;
    }
  }
  return null;
};

export const createServer = async (callback?: (error: any, app: Express) => any) => {
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

  const model = container.get<IAuthentication>(TYPES.IAuthentication);

  const context: ContextFunction = async ({ req }) => {
    const token = await getToken(model)(req.get("Authorization"));

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

  const server = new ApolloServer({
    context,
    typeDefs,
    resolvers,
    introspection: true,
    formatError: (error: any) => {
      if (error instanceof ValidationError) {
        return new InvalidInput(error.invalidFields);
      }
      console.error(error);
      return error;
    }
  });

  const app: Express = express();

  const oauth = new OAuthServer({
    model: model as any
  });

  const userService = container.get<IUserService>(TYPES.IUserService);

  const userCount = await userService.getUserCount();
  if (userCount === 0) {
    await userService.create({
      email: config.get("defaultUser.email"),
      password: config.get("defaultUser.password")
    });
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  server.applyMiddleware({ app });
  app.use(errorHandler);

  app.post("/oauth2/token", async (req, res) => {
    const response = await oauth.token(new Request(req), new Response(res));
    res.json(response);
  });

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
