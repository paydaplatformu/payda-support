
const MongoClient = require('mongodb').MongoClient;

exports.connect = url => new Promise((resolve, reject) => {
  const client = new MongoClient(url, { useNewUrlParser: true });
  client.connect(function(err) {
    if (err) return reject(err);
    console.log("Connected successfully to server");
    return resolve(client);
  });
})
