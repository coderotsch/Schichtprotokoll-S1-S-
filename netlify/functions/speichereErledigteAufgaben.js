const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async function (event, context) {
    try {
        const erledigteAufgaben = JSON.parse(event.body);
        
        await client.connect();
        const database = client.db('protokoll');
        const collection = database.collection('erledigteAufgaben');

        // Alle erledigten Aufgaben speichern (ersetze die alte Liste)
        await collection.deleteMany({}); // Lösche alte Daten
        const result = await collection.insertMany(erledigteAufgaben);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Erledigte Aufgaben gespeichert', result }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Fehler beim Speichern der erledigten Aufgaben', error }),
        };
    } finally {
        await client.close();
    }
};
