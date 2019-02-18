import { MongoClient, Collection } from 'mongodb';

export const connect = (url: string): Promise<MongoClient> =>
  new Promise((resolve, reject) => {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect(function(err) {
      if (err) return reject(err);
      console.log("Connected successfully to server");
      return resolve(client);
    });
  });

export const copyStream = (source: Collection, target: Collection) =>
  new Promise((resolve, reject) => {
    target.deleteMany({}).then(() => {
      const cursor = source.find();

      cursor.on("data", document => {
        target.insertOne(document);
      });

      cursor.once("error", error => {
        return reject(error);
      });

      cursor.once("end", () => {
        return resolve();
      });
    });
  });
