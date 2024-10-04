const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async function (event, context) {
    try {
        const unerledigteAufgaben = JSON.parse(event.body);
        
        await client.connect();
        const database = client.db('protokoll');
        const collection = database.collection('unerledigteAufgaben');

        // Alle unerledigten Aufgaben speichern (ersetze die alte Liste)
        await collection.deleteMany({}); // Lösche alte Daten
        const result = await collection.insertMany(unerledigteAufgaben);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Unerledigte Aufgaben gespeichert', result }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Fehler beim Speichern der unerledigten Aufgaben', error }),
        };
    } finally {
        await client.close();
    }
};
