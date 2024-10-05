const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async function (event, context) {
    try {
        // Überprüfe, ob event.body vorhanden ist
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Leerer Body, keine Daten empfangen.' }),
            };
        }

        console.log("Eingehende Schichtübergabe-Daten (raw):", event.body); // Logge die empfangenen Daten
        
        const schichtDaten = JSON.parse(event.body); // Daten vom Frontend empfangen

        await client.connect();
        console.log("Erfolgreich mit der Datenbank verbunden.");

        const database = client.db('protokoll');
        const collection = database.collection('schichtUebergaben');

        // Optional: Vorherige Einträge löschen (nicht empfohlen, wenn Daten dauerhaft sein sollen)
        await collection.deleteMany({});
        console.log("Alte Schichtübergaben gelöscht (falls vorhanden).");

        const result = await collection.insertOne(schichtDaten); // Neue Schichtübergabe speichern

        console.log("Schichtübergabe erfolgreich in die Datenbank eingefügt:", result);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Schichtübergabe erfolgreich gespeichert', result }),
        };
    } catch (error) {
        console.error("Fehler beim Speichern der Schichtübergabe:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Fehler beim Speichern der Schichtübergabe', error }),
        };
    } finally {
        await client.close();
        console.log("Datenbankverbindung geschlossen.");
    }
};
