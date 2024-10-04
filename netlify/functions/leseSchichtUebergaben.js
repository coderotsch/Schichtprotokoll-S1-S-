const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async function (event, context) {
    try {
        await client.connect();
        const database = client.db('protokoll');
        const collection = database.collection('schichtUebergaben');

        // Nur die letzte Schichtübergabe lesen
        const schichtDaten = await collection.findOne({});

        return {
            statusCode: 200,
            body: JSON.stringify(schichtDaten),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Fehler beim Abrufen der Schichtübergaben', error }),
        };
    } finally {
        await client.close();
    }
};
