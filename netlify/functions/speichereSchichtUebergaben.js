const { MongoClient } = require('mongodb');

// Verbindungs-URI zur MongoDB (aus Umgebungsvariable)
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async function (event, context) {
    try {
        // Prüfen, ob der Body leer ist
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Leerer Body, keine Daten empfangen.' }),
            };
        }

        // Empfangene Daten parsen
        const schichtDaten = JSON.parse(event.body);

        // Verbindung zur MongoDB herstellen (direkt verbinden)
        await client.connect();

        // Verbindung zur Datenbank und Collection herstellen
        const database = client.db('protokoll');
        const collection = database.collection('schichtUebergaben');

        // Speichern oder Aktualisieren der Schichtübergabe
        const result = await collection.updateOne(
            { uebergeber: schichtDaten.uebergeber }, // Filter nach uebergeber (kann angepasst werden)
            { $set: schichtDaten }, // Neue Daten setzen
            { upsert: true } // Falls nicht vorhanden, neues Dokument einfügen
        );

        // Erfolgsantwort zurückgeben
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Schichtübergabe erfolgreich gespeichert', result }),
        };
    } catch (error) {
        console.error('Fehler beim Speichern der Schichtübergabe:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Fehler beim Speichern der Schichtübergabe', error }),
        };
    } finally {
        // Verbindung zur Datenbank schließen
        await client.close();
    }
};
