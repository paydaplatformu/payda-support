#!/usr/bin/env node

const program = require("commander");
const { connect } = require("./utils/mongo");

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

    const sourceCollection = sourceClient.db().collection('packages');
    const targetCollection = targetClient.db().collection('packages');

    const pgks = await sourceCollection.find().toArray()

    const updatedPackages = pgks.map(pkg => ({
      _id: pkg._id,
      defaultTag: {
        code: "EN",
        name: pkg.name,
        description: pkg.description
      },
      tags: pkg.languages.map(language => ({
        code: language.code,
        name: language.name,
        description: language.description
      })),
      reference: "",
      createdAt: pkg.created_at,
      updatedAt: pkg.updated_at,
      repeatConfig: "NONE",
      image: pkg.image,
      price: {
        currency: pkg.price.currency,
        amount: pkg.price.value
      },
      priority: pkg.priority,
      isActive: true
    }))

    await targetCollection.deleteMany()
    await targetCollection.insert(updatedPackages)

    console.log(pgks, updatedPackages);
    sourceClient.close();
    targetClient.close();
    process.exit(0);
  } catch (error) {
    console.error(error.stack);
    process.exit(1);
  }
})();

// _id: ObjectId;
// defaultTag: IPackageTag;
// reference?: string;
// createdAt: Date;
// updatedAt: Date;
// repeatConfig: RepeatConfig;
// image?: string;
// price: IMonateryAmount;
// priority: number;
// tags: IPackageTag[];
// isActive: boolean;