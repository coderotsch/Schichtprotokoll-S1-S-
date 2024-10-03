// netlify/functions/saveTask.js
const { connectToDatabase } = require('./mongodb');

exports.handler = async function(event) {
  try {
    const taskData = JSON.parse(event.body); // Daten aus dem HTTP-Request erhalten
    const db = await connectToDatabase(process.env.MONGODB_URI); // Verbindungsstring aus Umgebungsvariable

    const collection = db.collection('tasks'); // Name der Sammlung in MongoDB
    const result = await collection.insertOne(taskData); // Aufgabe in MongoDB speichern

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Aufgabe erfolgreich gespeichert!', taskId: result.insertedId }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Fehler beim Speichern der Aufgabe' }),
    };
  }
};
























  //mongodb+srv://schlaepferroger:<db_password>@protokoll.5cdp6.mongodb.net/?retryWrites=true&w=majority&appName=Protokoll