const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async function (event, context) {
    try {
        await client.connect();
        const database = client.db('protokoll');
        const collection = database.collection('erledigteAufgaben');

        const erledigteAufgaben = await collection.find({}).toArray();

        return {
            statusCode: 200,
            body: JSON.stringify(erledigteAufgaben),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Fehler beim Abrufen der erledigten Aufgaben', error }),
        };
    } finally {
        await client.close();
    }
};
