const { MongoClient } = require('mongodb');
const { MONGO_URL } = require('../configs/keys.dev');

const client = new MongoClient(MONGO_URL);
const db = client.db();

module.exports = {
  client,
  db
};
