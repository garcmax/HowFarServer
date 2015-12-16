// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var friendSchema = new Schema({friendId: String, wantLocation: Boolean}, {strict: true});

var userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now},
    loc: {
        longitude: {type: String, required: true},
        latitude: {type: String, required: true},
        broadcast: {type: Boolean, default: false, required: true},
        date:{type: Date, default: Date.now, required: true}
        },
    friendsList: [friendSchema]
    }, {strict: true});

userSchema.static('findByUsername', function (username, callback) {
  return this.find({ username: username }, callback);
});

module.exports = mongoose.model('User', userSchema);