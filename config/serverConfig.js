var fs             = require('fs');

var config = {};
config.port = {
        https: '8443',
        default: '8080'
    };
config.mongoURI = {
        dev : 'mongodb://localhost/howfar',
        prod : process.env.BDD || 'mongodb://login:password@ds049624.mongolab.com:49624/howfar',
        test  : 'mongodb://localhost/node-test'
    };
config.env = process.env.NODE_ENV || "dev";
config.log = {
    format: process.env.LOG_FORMAT || "dev"
}

config.jwt = {
    issuer : process.env.JWT_ISSUER || 'niwamaxou',
    secret : process.env.JWT_SECRET || "supersecret",
    expire : process.env.JWT_EXPIRE || "120000"
}
module.exports = config;
