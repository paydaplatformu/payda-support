import convict from "convict";
import { isNonProduction } from "../utilities/helpers";

const convict_format_with_validator = require("convict-format-with-validator");
convict.addFormats(convict_format_with_validator);

convict.addFormat({
  name: "clients-array",
  coerce: (value: string) => JSON.parse(value),
  validate: (value: any) => {
    if (!Array.isArray(value)) {
      throw new Error("Clients should be an array");
    }
    const isValid = value.every((client) =>
      ["id", "secret", "grants", "accessTokenLifetime", "refreshTokenLifetime"].every((key) => key in client)
    );

    if (!isValid) {
      throw new Error(
        "Invalid clients format. Clients should have id, secret, grants, accessTokenLifetime and refreshTokenLifetime"
      );
    }
  },
});

const config = convict({
  environment: {
    doc: "The application environment.",
    format: ["production", "staging", "development", "test"],
    default: "production",
    env: "NODE_ENV",
  },
  host: {
    doc: "The IP address to bind.",
    format: "ipaddress",
    default: "0.0.0.0",
    env: "HOST",
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 8080,
    env: "PORT",
  },
  db: {
    url: {
      doc: "Database connection url",
      format: String,
      default: null,
      env: "DATABASE_URL",
    },
  },
  clients: {
    doc: "Clients",
    format: "clients-array",
    default: null,
    env: "CLIENTS",
  },
  defaultUser: {
    email: {
      doc: "User email to create if no user exists",
      format: String,
      default: "admin@paydaplatformu.org",
      env: "DEFAULT_USER_EMAIL",
    },
    password: {
      doc: "User password to create if no user exists",
      format: String,
      default: null,
      env: "DEFAULT_USER_PASSWORD",
    },
  },
  jwt: {
    issuer: {
      doc: "JWT Issuer",
      format: String,
      default: "payda",
      env: "JWT_ISSUER",
    },
    audience: {
      doc: "JWT Audience",
      format: String,
      default: "payda-supporters",
      env: "JWT_AUDIENCE",
    },
    subject: {
      doc: "JWT Subject",
      format: String,
      default: "login",
      env: "JWT_SUBJECT",
    },
    secret: {
      doc: "JWT Secret",
      format: String,
      default: null,
      env: "JWT_SECRET",
    },
    accessTokenLifetime: {
      doc: "Access token lifetime in seconds (clients setting overrides this value)",
      format: "int",
      default: 24 * 60 * 60,
    },
    refreshTokenLifetime: {
      doc: "Refresh token lifetime in seconds (clients setting overrides this value)",
      format: "int",
      default: 3 * 24 * 60 * 60,
    },
  },
  iyzico: {
    baseUrl: {
      doc: "Iyzico base url",
      format: "url",
      default: null,
      env: "IYZICO_BASE_URL",
    },
    apiKey: {
      doc: "Iyzico api key",
      format: String,
      default: null,
      env: "IYZICO_API_KEY",
    },
    secretKey: {
      doc: "Iyzico secret key",
      format: String,
      default: null,
      env: "IYZICO_SECRET_KEY",
    },
    callbackUrl: {
      doc: "Iyzico callback url",
      format: String,
      default: null,
      env: "IYZICO_CALLBACK_URL",
    },
  },
});

if (["development", "test", "staging"].includes(config.get("environment"))) {
  config.set("db.url", "mongodb://payda:paydapw@localhost:27017/paydadb?authSource=admin");

  config.set("jwt.secret", "secret");

  config.set("defaultUser.password", "123456");

  config.set("iyzico.baseUrl", "https://sandbox-api.iyzipay.com");
  config.set("iyzico.apiKey", "sandbox-v6mUQCgtToxpNffEvSXjMhdXgkZqRbQ5");
  config.set("iyzico.secretKey", "sandbox-PuJMxTCqTUb1aj7EgGhTsMdWDfwGX6jy");
  config.set("iyzico.callbackUrl", "http://localhost:3000/iyzico/form-callback");

  config.set(
    "clients",
    JSON.stringify([
      {
        id: "iframe",
        secret: "123456",
        grants: ["password", "refresh_token"],
        accessTokenLifetime: 60 * 60,
        refreshTokenLifetime: 24 * 60 * 60,
      },
    ])
  );
}

// Perform validation
config.validate({ allowed: "strict" });

export { config };
