const { MongoClient } = require('mongodb');

let cachedDb = null;

// Funktion zum Herstellen der Verbindung zur MongoDB-Datenbank
async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb;
  }

  // MongoDB Client initialisieren
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Verbindung herstellen
  await client.connect();
  const db = client.db('protokoll'); // Den Namen deiner Datenbank hier einfügen
  cachedDb = db;
  return db;
}

// Serverless-Funktion für Netlify
exports.handler = async function (event, context) {
  const uri = process.env.MONGODB_URI; // Stelle sicher, dass die Umgebungsvariable gesetzt ist

  if (!uri) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "MONGODB_URI Umgebungsvariable ist nicht gesetzt.",
      }),
    };
  }

  try {
    // Verbindung zur MongoDB herstellen
    const db = await connectToDatabase(uri);

    // Testen, ob die Verbindung funktioniert, indem du z.B. die Namen der Sammlungen abrufst
    const collections = await db.listCollections().toArray();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Erfolgreich mit MongoDB verbunden!",
        collections: collections.map(col => col.name),
      }),
    };
  } catch (error) {
    // Fehler bei der Verbindung abfangen
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Fehler bei der Verbindung zu MongoDB.",
        error: error.toString(),
      }),
    };
  }
};
