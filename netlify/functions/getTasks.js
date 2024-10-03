// netlify/functions/getTasks.js
const { connectToDatabase } = require('./mongodb');

exports.handler = async function(event) {
  try {
    const db = await connectToDatabase(process.env.MONGODB_URI);

    const collection = db.collection('tasks');
    const tasks = await collection.find({}).toArray(); // Alle Aufgaben abrufen

    return {
      statusCode: 200,
      body: JSON.stringify(tasks), // Aufgaben als JSON zurückgeben
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Fehler beim Abrufen der Aufgaben' }),
    };
  }
};