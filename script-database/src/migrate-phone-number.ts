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

    const targetCollection = targetClient.db().collection("donations");

    const updater = (donation: any) => {
      donation.phoneNumber = donation.phoneNumber || "+9005555555555";
      return donation;
    };

    const donations = await targetCollection.find().toArray();
    const promises = donations.map((document) =>
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
