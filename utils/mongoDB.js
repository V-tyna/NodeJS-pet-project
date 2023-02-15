const { MongoClient } = require('mongodb');

const keys = require('../configs/keys');

const client = new MongoClient(keys.MONGO_URL);
const db = client.db();

module.exports = {
  client,
  db
};
