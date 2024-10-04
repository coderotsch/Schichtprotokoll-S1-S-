const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://schlaepferroger:Rotscher2525%21@protokoll.5cdp6.mongodb.net/deinedatenbank?retryWrites=true&w=majority&appName=Protokoll";

    const client = new MongoClient(uri);

    try {
        // Verbindung zur Datenbank herstellen
        await client.connect();

        // Erfolgreiche Verbindung ausgeben
        console.log("Verbindung zu MongoDB erfolgreich hergestellt!");

    } catch (e) {
        console.error(e);
    } finally {
        await client.close(); // Verbindung schließen
    }
}

main().catch(console.error);
