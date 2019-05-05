#!/usr/bin/env node

import program from "commander";
import { connect, copyStream } from "./utils/mongo";

(async () => {
  try {
    program
      .version("0.1.0")
      .option("-s, --source <url>", "Source database")
      .option("-t, --target <url>", "Target database")
      .parse(process.argv);

    const { source, target } = program;

    if (!source) throw new Error("Source must be given.");
    if (!target) throw new Error("Target must be given.");

    const sourceClient = await connect(source);
    const targetClient = await connect(target);

    const collections = ["packages", "donations", "subscriptions", "users"];

    const promises = collections.map(collection => {
      const source = sourceClient.db().collection(collection);
      const target = targetClient.db().collection(collection);
      return copyStream(source, target);
    });

    await Promise.all(promises);

    sourceClient.close();
    targetClient.close();
    process.exit(0);
  } catch (error) {
    console.error(error.stack);
    process.exit(1);
  }
})();
