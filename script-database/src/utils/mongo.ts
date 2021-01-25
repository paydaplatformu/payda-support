import { MongoClient, Collection } from "mongodb";

export const connect = (url: string): Promise<MongoClient> =>
  new Promise((resolve, reject) => {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect(function (err) {
      if (err) {
        console.error({ err, url });
        return reject(err);
      }
      console.log("Connected successfully to server");
      return resolve(client);
    });
  });

export const copyCollection = async (
  source: Collection,
  target: Collection
) => {
  await target.deleteMany({});
  const input = await source.find().toArray();
  const promises = input.map(async (document) => target.insertOne(document));
  await Promise.all(promises);
};
