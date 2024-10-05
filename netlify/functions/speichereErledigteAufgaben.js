const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority"; // Ersetze dies mit deinen MongoDB-Verbindungsdaten

    const client = new MongoClient(uri);

    try {
        // Verbindung zur Datenbank herstellen
        await client.connect();

        // Erfolgreiche Verbindung ausgeben
        console.log("Verbindung zu MongoDB erfolgreich hergestellt!");

        // Zugriff auf die Datenbank (ersetze <dbname> mit deinem Datenbanknamen)
        const database = client.db("<dbname>");

        // Zugriff auf die Collection (ersetze <collectionname> mit deinem Collection-Namen)
        const collection = database.collection("<collectionname>");

        // Ein einfaches Dokument aus der Collection abrufen (z.B. das erste Dokument)
        const document = await collection.findOne();

        if (document) {
            console.log("Dokument gefunden:", document);
        } else {
            console.log("Kein Dokument in der Collection gefunden.");
        }

    } catch (e) {
        console.error("Fehler bei der Verbindung oder Abfrage:", e);
    } finally {
        await client.close(); // Verbindung schließen
    }
}

main().catch(console.error);
