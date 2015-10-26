// grab the mongoose module
var mongoose = require('mongoose');
var schema = mongoose.Schema;


var friendSchema = new schema({friendId: String});

var userSchema = new schema({
    login: String,
    password: String,
    date: {type: Date, default: Date.now},
    location: {
        longitude: String,
        latitude: String,
        broadcast: {type: Boolean, default: false},
        date:{type: Date, default: Date.now}
        },
    friendsList: [friendSchema]
    });

userSchema.static('findByLogin', function (login, callback) {
  return this.find({ login: login }, callback);
});

module.exports = mongoose.model('User', userSchema);