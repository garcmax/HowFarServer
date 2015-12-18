// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var friendSchema = new Schema({username: String, id: String, 
                                wantLocation:{type:Boolean, default: true}}, {strict: true});

var userSchema = new Schema({
    username: {type: String, required: true, index: true, unique: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now},
    loc: {
        longitude: {type: String},
        latitude: {type: String},
        broadcast: {type: Boolean, default: false},
        date:{type: Date, default: Date.now}
        },
    friendsList: [friendSchema]
    }, {strict: true, autoIndex: false});

userSchema.static('findByUsername', function (username, callback) {
  return this.find({ username: username }, callback);
});

module.exports = mongoose.model('User', userSchema);