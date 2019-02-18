#!/usr/bin/env node

import program from "commander";
import { connect } from "./utils/mongo";
import { fromCursor, insertDocument } from "./utils/observable";
import { concat } from "rxjs";
import { flatMap, map } from "rxjs/operators";
import { convertPackage, convertDonation, setPackage } from "./utils/migration";

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

    const sourcePackages = sourceClient.db().collection("packages");
    const targetPackages = targetClient.db().collection("packages");

    const sourceDonations = sourceClient.db().collection("donations");
    const targetDonations = targetClient.db().collection("donations");

    await targetPackages.deleteMany({});
    await targetDonations.deleteMany({});

    const insertPackage = insertDocument(targetPackages);
    const insertDonation = insertDocument(targetDonations);

    const packageOperations$ = fromCursor(sourcePackages.find()).pipe(
      flatMap(
        obs =>
          obs.pipe(
            map(convertPackage),
            flatMap(insertPackage)
          ),
        20
      )
    );

    const donationOperations$ = fromCursor(sourceDonations.find()).pipe(
      flatMap(
        obs =>
          obs.pipe(
            flatMap(setPackage(targetPackages)),
            map(convertDonation),
            flatMap(insertDonation)
          ),
        20
      )
    );

    const observable = concat(packageOperations$, donationOperations$);
    observable.subscribe({
      error: err => {
        console.error(err);
        process.exit(1);
      },
      complete: async () => {
        await Promise.all([sourceClient.close(), targetClient.close()]);
        process.exit(0);
      }
    });

  } catch (error) {
    console.error(error.stack);
    process.exit(1);
  }
})();
