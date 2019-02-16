const MongoClient = require("mongodb").MongoClient;

exports.connect = url =>
  new Promise((resolve, reject) => {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect(function(err) {
      if (err) return reject(err);
      console.log("Connected successfully to server");
      return resolve(client);
    });
  });

exports.copyStream = (source, target) =>
  new Promise((resolve, reject) => {
    target.deleteMany().then(() => {
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
