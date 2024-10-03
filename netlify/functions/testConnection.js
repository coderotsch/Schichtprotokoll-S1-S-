// netlify/functions/testConnection.js
const { MongoClient } = require('mongodb');

exports.handler = async function(event, context) {
  try {
    // Verbindungszeichenfolge aus den Umgebungsvariablen abrufen
    const client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Verbindung zur MongoDB herstellen
    await client.connect();
    const db = client.db('protokoll');  // Name der Datenbank

    // Sammlungen abrufen, um die Verbindung zu testen
    const collections = await db.listCollections().toArray();

    // Erfolgreiche Rückgabe
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Erfolgreich mit MongoDB verbunden!',
        collections, // Gibt die vorhandenen Sammlungen in der Datenbank zurück
      }),
    };
  } catch (error) {
    // Fehler abfangen und zurückgeben
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Fehler beim Herstellen der Verbindung zu MongoDB',
        details: error.message,
      }),
    };
  }
};
