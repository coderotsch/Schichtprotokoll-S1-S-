const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; // Verbindungs-URI aus Umgebungsvariablen
const client = new MongoClient(uri);

exports.handler = async function (event, context) {
    let connectionEstablished = false;
    try {
        // Logge die eingehenden Daten
        console.log("Eingehende Schichtübergabe-Daten (raw):", event.body);

        // Versuche die empfangenen Daten zu parsen
        let schichtDaten;
        try {
            schichtDaten = JSON.parse(event.body); // Daten vom Frontend empfangen
            console.log("Geparste Schichtübergabe-Daten:", schichtDaten);
        } catch (parseError) {
            console.error("Fehler beim Parsen der eingehenden Daten:", parseError);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Fehler beim Parsen der Schichtübergabe-Daten', error: parseError }),
            };
        }

        // Verbindung zur Datenbank herstellen
        await client.connect();
        connectionEstablished = true; // Markiere die erfolgreiche Verbindung
        console.log("Erfolgreich mit der Datenbank verbunden.");

        // Zugriff auf die Datenbank und Collection
        const database = client.db('protokoll');
        const collection = database.collection('schichtUebergaben');

        // Optional: Vorherige Einträge löschen (nur wenn das wirklich erwünscht ist)
        const deleteResult = await collection.deleteMany({});
        console.log(`Alte Schichtübergaben gelöscht: ${deleteResult.deletedCount} Einträge.`);

        // Neue Schichtübergabe-Daten einfügen
        const insertResult = await collection.insertOne(schichtDaten);
        console.log("Schichtübergabe erfolgreich in die Datenbank eingefügt:", insertResult);

        // Erfolgreiche Antwort zurückgeben
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Schichtübergabe erfolgreich gespeichert', result: insertResult }),
        };
    } catch (error) {
        console.error("Fehler beim Speichern der Schichtübergabe:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Fehler beim Speichern der Schichtübergabe', error: error.toString() }),
        };
    } finally {
        // Stelle sicher, dass die Verbindung nur geschlossen wird, wenn sie aufgebaut wurde
        if (connectionEstablished) {
            await client.close();
            console.log("Datenbankverbindung geschlossen.");
        }
    }
};
