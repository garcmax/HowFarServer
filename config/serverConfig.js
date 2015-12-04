var config = {};
config.port = {
        httpsPort: '8443',
        httpPort: '8080'
    };
config.mongoURI = {
        dev : 'mongodb://localhost/howfar',
        prod : process.env.BDD || 'mongodb://howfar:howfarpwd@ds049624.mongolab.com:49624/howfar',
        test  : 'mongodb://localhost/node-test'
    };
config.env = process.env.NODE_ENV || "dev";
config.log = {
    format: process.env.LOG_FORMAT || "dev"
}
config.secret = process.env.JWT_SECRET || "supersecret"
module.exports = config;