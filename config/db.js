const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        db: 'mongodb://localhost:27017/test-ahhihi'
    },
    production: {
        db: 'mongodb://felipe:ga$$369@ds033116.mlab.com:33116/d4udb'
    }
};

module.exports = config[env];