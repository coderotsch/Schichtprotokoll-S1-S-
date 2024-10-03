// netlify/functions/testConnection.js
const { connectToDatabase } = require('./mongodb');

exports.handler = async function(event, context) {
  try {
    // Versuche die Verbindung zur Datenbank herzustellen
    const db = await connectToDatabase(process.env.MONGODB_URI);
    
    // Prüfe, ob die Verbindung erfolgreich war, indem du die Datenbank-Namen abfragst
    const collections = await db.listCollections().toArray();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Erfolgreich mit MongoDB verbunden!', collections }),
    };
  } catch (error) {
    // Gebe im Fehlerfall die entsprechende Fehlermeldung zurück
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Fehler beim Herstellen der Verbindung zu MongoDB', details: error.message }),
    };
  }
};
