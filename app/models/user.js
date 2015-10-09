// grab the mongoose module
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({login: String, password: String, date: {type: Date, default: Date.now}});

module.exports = mongoose.model('User', userSchema);