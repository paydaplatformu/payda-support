#!/usr/bin/env node

import program from "commander";
import { connect } from "./utils/mongo";

(async () => {
  try {
    program
      .version("0.1.0")
      .option("-t, --target <url>", "Target database")
      .parse(process.argv);

    const { target } = program;

    if (!target) throw new Error("Target must be given.");

    const targetClient = await connect(target);

    const targetCollection = targetClient.db().collection("packages");

    const updater = (pkg: any) => {
      if (pkg.id === "5e7dbcfab840e2003e4ebba5") {
        // console.log(pkg);
      }
      pkg.recurrenceConfig = pkg.recurrenceConfig || {};
      pkg.recurrenceConfig.count = 1;
      pkg.recurrenceConfig.repeatInterval = pkg.repeatInterval || "NONE";
      delete pkg.repeatInterval;
      if (pkg.id === "5e7dbcfab840e2003e4ebba5") {
        // console.log(pkg);
      }
      return pkg;
    };

    const packages = await targetCollection.find().toArray();
    const promises = packages.map((document) =>
      targetCollection.findOneAndReplace(
        { _id: document._id },
        updater(document)
      )
    );

    await Promise.all(promises);

    console.log("DONE");
    targetClient.close();
    process.exit(0);
  } catch (error) {
    console.error(error.stack);
    process.exit(1);
  }
})();
