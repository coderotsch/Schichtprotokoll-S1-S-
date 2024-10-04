const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async function (event, context) {
    try {
        await client.connect();
        const database = client.db('protokoll');
        const collection = database.collection('maschinenStatus');

        const maschinenBereich = await collection.find({}).toArray();

        return {
            statusCode: 200,
            body: JSON.stringify(maschinenBereich),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Fehler beim Abrufen des Maschinenbereichs', error }),
        };
    } finally {
        await client.close();
    }
};
