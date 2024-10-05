const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async function (event, context) {
    try {
        // Überprüfen, ob der body nicht leer ist
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Leerer Body, keine Daten empfangen.' }),
            };
        }

        console.log("Eingehende Schichtübergabe-Daten:", event.body);

        const schichtDaten = JSON.parse(event.body);

        await client.connect();
        const database = client.db('protokoll');
        const collection = database.collection('schichtUebergaben');

        // Speichere die Schichtübergabe
        const result = await collection.insertOne(schichtDaten);

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
    }
};