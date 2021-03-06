import { ApolloServer } from "apollo-server-express";
import * as bodyParser from "body-parser";
import chalk from "chalk";
import cors from "cors";
import express, { Express } from "express";
import "express-async-errors";
import * as fs from "fs";
import { Container } from "inversify";
import OAuthServer, { Request, Response } from "oauth2-server";
import * as path from "path";
import { config } from "./config";
import { production, test } from "./container";
import { errorHandler } from "./middleware/errorHandler";
import { Authentication } from "./models/Authentication";
import { DonationService } from "./services/donation/DonationService";
import { UserService } from "./services/user/UserService";
import schema from "./schema";
import { TYPES } from "./types";
import { bindMongoDb, createAdminUser, createGraphQLContext } from "./utilities/server";
import { isNonProduction, isProduction } from "./utilities/helpers";
import axios from "axios";
import { PackageService } from "./services/package/PackageService";
import { RepeatInterval } from "./generated/graphql";
import { IyzicoService } from "./services/iyzico/IyzicoService";

const STATIC_DIR = path.resolve(__dirname, "./static");
const MOCK_HTML = fs.readFileSync(`${STATIC_DIR}/mock.html`).toString("utf-8");

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
    const donationService = container.get<DonationService>(TYPES.DonationService);
    const packageService = container.get<PackageService>(TYPES.PackageService);
    const iyzicoService = container.get<IyzicoService>(TYPES.IyzicoService);

    const initializationPromises = Object.values(TYPES)
      .flatMap((type) => container.getAll(type))
      .filter((instance: any) => instance.initiate)
      .map((instance: any) => instance.initiate());

    await Promise.all(initializationPromises);

    await createAdminUser(userService);

    const context = createGraphQLContext(container, model);

    const server = new ApolloServer({
      context,
      schema,
      playground: true,
      introspection: true,
      formatError: (error: any) => {
        console.error(error);
        console.error(error.extensions.exception);
        delete error.extensions.exception;
        return error;
      },
    });

    const app: Express = express();

    const oauth = new OAuthServer({
      model,
    });

    /**
     * Express middlewares
     */
    app.use(cors());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    server.applyMiddleware({ app });

    if (isProduction()) {
      app.use((req, res, next) => {
        if (req.headers["x-forwarded-proto"] === "https" || req.secure) {
          return next();
        } else {
          res.redirect("https://" + req.headers.host + req.url);
        }
      });
    }

    app.use(errorHandler);

    /**
     * Authentication
     */
    app.post("/oauth2/token", async (req, res) => {
      const response = await oauth.token(new Request(req), new Response(res));
      res.send(response);
    });

    /**
     * Serve images
     */

    app.use("/static", express.static(path.resolve(__dirname, "static")));

    if (isNonProduction()) {
      app.get("/mock", (req, res) => {
        res.header("Content-Type", "text/html").send(MOCK_HTML.replace("{{DONATION_ID}}", "None"));
      });

      app.post("/mock", (req, res) => {
        res
          .header("Content-Type", "text/html")
          .send(MOCK_HTML.replace("{{DONATION_ID}}", req.body.ORDER_REF.split(".")[0]));
      });

      app.post("/mock/:handler", async (req, res) => {
        switch (req.params.handler) {
          case "payment": {
            const donationId = req.body.donationId;
            const donation = await donationService.getById(donationId);
            if (!donation) return res.send("Donation not found.");

            const pkg = await packageService.getById(donation.packageId);
            if (!pkg) return res.send("Package not found.");

            const isRepeating = pkg.recurrenceConfig.repeatInterval !== RepeatInterval.None;

            const dummyInput = {
              HASH: "somehash",
              REFNOEXT: donationId,
              TOKEN_HASH: isRepeating ? "mock_token" : undefined,
              mockPayment: true,
            };
            await axios.post(`http://${host}:${port}/notification`, dummyInput);
            return res.redirect(config.get("iyzico.callbackUrl"));
          }
          default:
            return res.send("Error");
        }
      });
    }

    /**
     * Iyzico routes
     */

    app.post("/iyzico/form-callback", async (req, res) => {
      const token = req.body.token;
      const result = await iyzicoService.retrievePaymentResult(token);
      console.log({ result });
      if (result.status !== "success") {
        return res.redirect("/error");
      }
      return res.redirect("/thank-you");
    });

    app.post("/iyzico/webhook", async (req, res) => {
      console.log(req.body);
      console.log(req.headers);
      const received = req.header("X-IYZ-SIGNATURE");
      console.log({ received });
      const expected = iyzicoService.getWebhookSignature(req.body.iyziEventType, req.body.token);
      console.log({ received, expected });

      if (req.body.paymentId && !req.body.token) {
        return res.status(201).send();
      }

      // FIXME: iyzico sends empty header
      // if (!received || received !== expected) {
      //   return res.status(400).json({ message: "Incorrect signature" });
      // }

      console.log("webook success");
      const result = await iyzicoService.retrievePaymentResult(req.body.token);
      console.log({ result });
      const donationId = iyzicoService.extractDonationIdFromReference(result.basketId);
      console.log({ result, donationId });

      const donation = await donationService.getById(donationId);
      console.log({ result, donationId, donation });
      if (!donation) throw new Error("Donation id not found.");
      await donationService.confirmPayment(donationId);
      return res.status(201).send();
    });

    /**
     * Rest of the routes are managed by frontend
     */
    app.use(express.static(path.resolve(__dirname, "../frontend-dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../frontend-dist", "index.html"));
    });
    app.post("*", (req, res) => {
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
