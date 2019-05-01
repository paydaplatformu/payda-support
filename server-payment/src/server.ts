import { ApolloServer } from "apollo-server-express";
import * as bodyParser from "body-parser";
import chalk from "chalk";
import cors from "cors";
import express, { Express } from "express";
import "express-async-errors";
import { Container } from "inversify";
import OAuthServer, { Request, Response } from "oauth2-server";
import path from "path";
import { config } from "./config";
import { production, test } from "./container";
import { errorHandler } from "./middleware/errorHandler";
import { Authentication } from "./models/Authentication";
import { IDonationService } from "./models/DonationService";
import { InvalidInput, ValidationError } from "./models/Errors";
import { PayuService } from "./models/PayuService";
import { UserService } from "./models/UserService";
import { resolvers, typeDefs } from "./schema";
import { TYPES } from "./types";
import { bindMongoDb, createAdminUser, createGraphQLContext } from "./utilities/server";

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

export const createServer = async (callback?: (error?: any, app?: Express) => any) => {
  try {
    await bindMongoDb(container, log);

    const userService = container.get<UserService>(TYPES.UserService);
    const model = container.get<Authentication>(TYPES.Authentication);
    const payuService = container.get<PayuService>(TYPES.PayuService);
    const donationService = container.get<IDonationService>(TYPES.IDonationService);

    const initializationPromises = Object.values(TYPES)
      .flatMap(type => container.getAll(type))
      .filter((instance: any) => instance.initiate)
      .map((instance: any) => instance.initiate());

    await Promise.all(initializationPromises);

    await createAdminUser(userService);

    const context = createGraphQLContext(container, model);

    const server = new ApolloServer({
      context,
      typeDefs,
      resolvers,
      introspection: true,
      formatError: (error: any) => {
        delete error.extensions.exception;
        console.error(error);
        return error;
      }
    });

    const app: Express = express();

    const oauth = new OAuthServer({
      model
    });

    /**
     * Express middlewares
     */
    app.use(cors());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    server.applyMiddleware({ app });
    app.use(errorHandler);

    /**
     * Authentication
     */
    app.post("/oauth2/token", async (req, res) => {
      const response = await oauth.token(new Request(req), new Response(res));
      res.send(response);
    });

    /**
     * Payu Endpoints
     */
    app.post("/notification", async (req, res) => {
      const { returnHash, donationId } = await payuService.verifyNotification(req.body);
      await donationService.confirmPayment(donationId);
      res.send(returnHash);
    });

    /**
     * Serve images
     */

    app.use("/static", express.static(path.resolve(__dirname, "static")));

    /**
     * Rest of the routes are managed by frontend
     */
    app.use(express.static(path.resolve(__dirname, "../frontend-dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../frontend-dist", "index.html"));
    });

    /**
     * Start application
     */
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
  } catch (error) {
    log(`  ${chalk.red("Application failed to initialize")}`);
    console.error(error.stack);
    if (callback) {
      callback(error);
    }
  }
};
