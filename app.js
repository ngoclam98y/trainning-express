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
            console.log("connect mongoose success");
        }
    );
} catch (error) {
    console.log("connect mongoose faild");
}


app.listen(port, function () {
    console.log('server start');
});