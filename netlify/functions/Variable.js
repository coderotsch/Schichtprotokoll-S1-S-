const { MongoClient } = require('mongodb');

exports.handler = async function (event, context) {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'MONGODB_URI Umgebungsvariable nicht gesetzt.' }),
        };
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('protokoll');
        const collection = db.collection('maschinenStatus');
        const document = await collection.findOne();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Erfolgreich mit MongoDB verbunden!', document }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Fehler bei der Verbindung zu MongoDB', error: error.toString() }),
        };
    } finally {
        await client.close();
    }
};