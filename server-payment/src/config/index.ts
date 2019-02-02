import convict from "convict";

convict.addFormat({
  name: "clients-array",
  coerce: (value: string) => JSON.parse(value),
  validate: (value: any) => {
    if (!Array.isArray(value)) {
      throw new Error("Clients should be an array");
    }
    const isValid = value.every(client =>
      ["id", "secret", "grants", "accessTokenLifetime", "refreshTokenLifetime"].every(key => key in client)
    );

    if (!isValid) {
      throw new Error(
        "Invalid clients format. Every client should have id, secret, grants, accessTokenLifetime and refreshTokenLifetime"
      );
    }
  }
});

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
    format: "clients-array",
    default: null,
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
  },
  payu: {
    url: {
      doc: "Payu lu url",
      format: "url",
      default: "https://secure.payu.com.tr/order/lu.php",
      env: "PAYU_URL"
    },
    backRef: {
      doc: "Payu backref",
      format: String,
      default: null,
      env: "PAYU_BACK_REF"
    },
    defaultCredentials: {
      merchant: {
        doc: "Payu merchant name",
        format: String,
        default: null,
        env: "PAYU_DEFAULT_CREDENTIALS_MERCHANT"
      },
      secret: {
        doc: "Payu secret",
        format: String,
        default: null,
        env: "PAYU_DEFAULT_CREDENTIALS_SECRET"
      }
    },
    amexCredentials: {
      merchant: {
        doc: "Payu merchant name",
        format: String,
        default: null,
        env: "PAYU_AMEX_CREDENTIALS_MERCHANT"
      },
      secret: {
        doc: "Payu secret",
        format: String,
        default: null,
        env: "PAYU_AMEX_CREDENTIALS_SECRET"
      }
    }
  }
});

if (["development", "test"].includes(config.get("environment"))) {
  config.set("db.url", "");
  config.set("jwt.secret", "secret");
  config.set("defaultUser.password", "123456");
  config.set("payu.backRef", "http://localhost:8080");
  config.set("payu.defaultCredentials.merchant", "payu_default");
  config.set("payu.defaultCredentials.secret", "123456");
  config.set("payu.amexCredentials.merchant", "payu_amex");
  config.set("payu.amexCredentials.secret", "654321");
  config.set(
    "clients",
    JSON.stringify([
      {
        id: "iframe",
        secret: "123456",
        grants: ["password", "refresh_token"],
        accessTokenLifetime: 60 * 60,
        refreshTokenLifetime: 24 * 60 * 60
      }
    ])
  );
}

// Perform validation
config.validate({ allowed: "strict" });

export { config };
