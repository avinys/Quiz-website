const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    database = client.db('quiz');
}

function getDb() {
    if(!database) {
        throw new Error('You must connect first!');
    }

    return database;
}

module.exports = {
    connectToDatatbase: connectToDatabase,
    getDb: getDb
};
