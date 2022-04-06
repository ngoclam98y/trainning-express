const express = require('./config/express.js');
const dbConfig = require('./config/db');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

const app = express();

mongoose.Promise = global.Promise;

try {
    mongoose.connect(
        dbConfig.db,
        { useMongoClient: true, },
        () => {

        }
    );
} catch (error) {
}


const db = mongoose.connection;
db.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db);
});

app.listen(port, function () {
    console.log('server start');
});