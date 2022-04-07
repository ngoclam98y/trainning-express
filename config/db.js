const dotenv = require('dotenv');
dotenv.config();

const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        db: 'mongodb://localhost:27017/trainning'
    },
    production: {
        db: ''
    }
};

module.exports = config[env];