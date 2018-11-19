import convict from "convict";

const config = convict({
  environment: {
    doc: "The application environment.",
    format: ["production", "staging", "development", "test"],
    default: "production",
    env: "NODE_ENV"
  },
  host: {
    doc: "The IP address to bind.",
    format: "ipaddress",
    default: "0.0.0.0",
    env: "HOST"
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 8080,
    env: "PORT"
  },
  db: {
    url: {
      doc: "Database connection url",
      format: String,
      default: null,
      env: "DATABASE_URL"
    }
  },
  clients: {
    doc: "Clients",
    format: Array,
    default: [
      {
        id: "iframe",
        secret: "T*.!f6s4*W&=!Fs*",
        grants: ["password", "refresh_token"],
        accessTokenLifetime: 60 * 60,
        refreshTokenLifetime: 24 * 60 * 60
      }
    ],
    env: "CLIENTS"
  },
  defaultUser: {
    email: {
      doc: "User email to create if no user exists",
      format: String,
      default: "admin@paydaplatformu.org",
      env: "DEFAULT_USER_EMAIL"
    },
    password: {
      doc: "User password to create if no user exists",
      format: String,
      default: null,
      env: "DEFAULT_USER_PASSWORD"
    }
  },
  jwt: {
    issuer: {
      doc: "JWT Issuer",
      format: String,
      default: "payda",
      env: "JWT_ISSUER"
    },
    audience: {
      doc: "JWT Audience",
      format: String,
      default: "payda-supporters",
      env: "JWT_AUDIENCE"
    },
    subject: {
      doc: "JWT Subject",
      format: String,
      default: "login",
      env: "JWT_SUBJECT"
    },
    secret: {
      doc: "JWT Secret",
      format: String,
      default: null,
      env: "JWT_SECRET"
    },
    accessTokenLifetime: {
      doc: "Access token lifetime in seconds (clients setting overrides this value)",
      format: "int",
      default: 60 * 60
    },
    refreshTokenLifetime: {
      doc: "Refresh token lifetime in seconds (clients setting overrides this value)",
      format: "int",
      default: 24 * 60 * 60
    }
  }
});

if (["development", "test"].includes(config.get("environment"))) {
  config.set("db.url", "");
  config.set("jwt.secret", "secret");
  config.set("defaultUser.password", "123456");
}

// Perform validation
config.validate({ allowed: "strict" });

export { config };
