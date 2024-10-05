const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async function (event, context) {
    try {
        // Überprüfe, ob event.body vorhanden ist und Daten enthält
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Leerer Body, keine Daten empfangen.' }),
            };
        }

        // Logge die eingehenden Daten
        console.log("Eingehende Schichtübergabe-Daten (raw):", event.body);

        // Parsen der empfangenen JSON-Daten
        const schichtDaten = JSON.parse(event.body);
        if (!schichtDaten.uebergeber || !schichtDaten.uebernehmer || !schichtDaten.datum) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Ungültige Daten. Übergeber, Übernehmer und Datum sind erforderlich.' }),
            };
        }

        // Verbindung zur MongoDB herstellen
        await client.connect();
        console.log("Erfolgreich mit der Datenbank verbunden.");

        const database = client.db('protokoll');
        const collection = database.collection('schichtUebergaben');

        // Vorherige Einträge löschen (optional, falls notwendig)
        await collection.deleteMany({});
        console.log("Alte Schichtübergaben gelöscht.");

        // Schichtübergabe-Daten speichern
        const result = await collection.insertOne(schichtDaten);
        console.log("Schichtübergabe erfolgreich in die Datenbank eingefügt:", result);

        // Erfolgreiche Antwort zurücksenden
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Schichtübergabe erfolgreich gespeichert', result }),
        };

    } catch (error) {
        // Fehlerbehandlung
        console.error("Fehler beim Speichern der Schichtübergabe:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Fehler beim Speichern der Schichtübergabe', error }),
        };
    } finally {
        // Verbindung zur Datenbank schließen
        await client.close();
        console.log("Datenbankverbindung geschlossen.");
    }
};
