// grab the mongoose module
var mongoose = require('mongoose');
var schema = mongoose.Schema;


var friendSchema = new schema({friendId: String});

var userSchema = new schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now},
    location: {
        longitude: String,
        latitude: String,
        broadcast: {type: Boolean, default: false},
        date:{type: Date, default: Date.now}
        },
    friendsList: [friendSchema]
    });

userSchema.static('findByUsername', function (username, callback) {
  return this.find({ username: username }, callback);
});

module.exports = mongoose.model('User', userSchema);