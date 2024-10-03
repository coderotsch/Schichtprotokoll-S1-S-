// netlify/functions/mongodb.js
const { MongoClient } = require('mongodb');

let cachedDb = null;

async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db('protokoll'); // Hier den Namen deiner MongoDB-Datenbank einfügen
  cachedDb = db;
  return db;
}

module.exports = { connectToDatabase };
