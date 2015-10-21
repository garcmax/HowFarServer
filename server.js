// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var path           = require('path');
var https          = require('https');
var http           = require('http');
var fs             = require('fs');

// configuration ===========================================

// config files
var db = require('./config/db');
var config = require('./config/serverConfig');

//get certificat
var options = {
    key:fs.readFileSync('./config/key.pem'),
    cert:fs.readFileSync('./config/cert.pem')
};

// set our port
//var port = process.env.PORT || 8443;

// connect to our mongoDB database
mongoose.connect(db.url);

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// routes ==================================================
/*require('./app/routes')(app); // configure our routes*/
require('./app/routes')(app, express);


// start app ===============================================
http.createServer(app).listen(config.httpPort);
https.createServer(options, app).listen(config.httpsPort);


// shoutout to the user
console.log('Http magic happens on port ' + config.httpPort);
console.log('Https magic happens on port ' + config.httpsPort);
//console.log("__dirname = %s", path.resolve(__dirname));

// expose app
exports = module.exports = app;
