var config = {};
config.port = {
        httpsPort: '8443',
        httpPort: '8080'
    };
config.mongoURI = {
        dev : 'mongodb://localhost/howfar',
        cloud : 'mongodb://howfar:howfarpwd@ds049624.mongolab.com:49624/howfar',
        test  : 'mongodb://localhost/node-test'
    };
config.env = process.env.NODE_ENV || "dev";
module.exports = config;