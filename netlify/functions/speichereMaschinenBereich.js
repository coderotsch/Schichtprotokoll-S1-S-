const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async function (event, context) {
    try {
        const maschinenBereich = JSON.parse(event.body);
        
        await client.connect();
        const database = client.db('protokoll');
        const collection = database.collection('maschinenStatus');

        // Speichern des Maschinenbereichs (ersetze die alten Daten)
        await collection.deleteMany({}); // Lösche alte Daten
        const result = await collection.insertMany(maschinenBereich);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Maschinenbereich erfolgreich gespeichert', result }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Fehler beim Speichern des Maschinenbereichs', error }),
        };
    } finally {
        await client.close();
    }
};
