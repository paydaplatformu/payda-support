import convict from "convict";

const config = convict({
  environment: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
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
      default: "",
      env: "DATABASE_URL"
    }
  }
});

if (config.get("environment")) {
  config.set("db.url", "");
}

// Perform validation
config.validate({ allowed: "strict" });

export { config };
