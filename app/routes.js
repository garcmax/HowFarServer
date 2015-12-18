var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

var User = require('./models/user');
var config = require("../config/serverConfig");

module.exports = function (app, express) {
    // ROUTES FOR OUR API
    // =============================================================================
    var router = express.Router();              // get an instance of the express Router

    // middleware to use for all requests
    router.use(function (req, res, next) {
        if (!(req.url == '/login' || req.url == '/register')) {
            var bearer = req.headers.authorization.split(" ");
            if (bearer.length != 2) {
                res.status(401).json({ success: false, message: "failed to retrieve bearer" });
            }
            var token = bearer[1];
            jwt.verify(token, config.jwt.secret, function (err, decoded) {
                if (err)
                    res.status(401).json({ success: false, message: "failed to authenticate token" });
                else {
                    req.decoded = decoded;
                }
                next(); // make sure we go to the next routes and don't stop here
            });
        } else {
            next();
        }
    });


    // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
    router.get('/', function (req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
    });

    // more routes for our API will happen here

    //log the user
    router.route('/login')
        .post(function (req, res) {
            User.findByUsername(req.body.username, function (err, userArr) {
                if (err) {
                    res.status(500).json({ success: false, message: "login server error", error: err });
                    return;
                }
                if (userArr.length === 0) {
                    res.status(401).json({ success: false, message: "bad credentials" });
                    return;
                }
                if (bcrypt.compareSync(req.body.password, userArr[0].password)) {
                    res.location('/users/' + userArr[0]._id);
                    res.status(200).json({ success: true, message: "logged" });
                    return;
                }
                res.status(401).json({ success: false, message: "bad credentials" });
            });
        });

    //register the user
    router.route('/register')
        .post(function (req, res) {
            var body = req.body;
            if (body.username.length < 3 || body.password.length < 4) {
                res.status(400).json({ success: false, message: "username or password too short" });
                return;
            }
            var user = new User();
            user.username = req.body.username;
            var salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(req.body.password, salt);
            user.save(function (err) {
                if (err) {
                    res.status(500).json({ success: false, message: "fail to register", error: err });
                }
                else {
                    var token = jwt.sign({}, config.jwt.secret, {
                        issuer: config.jwt.issuer,
                        audience: user._id,
                        expiresIn: config.jwt.expire
                    });
                    res.location('/users/' + user._id);
                    res.status(201).json({ success: true, message: "user created", token: token });
                }
            });
        });

    //get all users
    router.route('/users')
        .get(function (req, res) {
            User.find(function (err, users) {
                if (err)
                    res.status(500).json({ success: false, message: "fail to get users", error: err });
                res.status(200).json({ success: true, users: users });
            });
        });

    router.route('/users/:user_id')
    //get one user from his id
        .get(function (req, res) {
            if (req.decoded.aud != req.params.user_id) {
                res.status(403).json({ success: false, message: 'bad token' });
            }
            User.findById(req.params.user_id, function (err, user) {
                if (err)
                    res.status(500).json({ success: false, message: "fail to get user", error: err });
                res.status(200).json({ success: true, user: user });
            });
        });

    router.route('/users/:user_id/username')
    //update the username of a user
        .put(function (req, res) {
            if (req.decoded.aud != req.params.user_id) {
                res.status(403).json({ success: false, message: 'bad token' });
            }
            User.findById(req.params.user_id, function (err, user) {
                if (err)
                    res.json(err);
                user.username = req.body.username;
                user.save(function (err) {
                    if (err)
                        res.status(500).json({ success: false, message: "fail to change username", error: err });
                    else
                        res.status(200).json({ success: true, message: "username changed" });
                });
            });
        });


    router.route('/users/:user_id/friends')
    //get all friends
        .get(function (req, res) {
            User.findById(req.params.user_id, function (err, user) {
                if (err)
                    res.status(500).json({ success: false, message: "fail to get friends", error: err });
                res.status(200).json({ success: true, friendList: user.friendsList });
            });
        })
    //add a friend
        .put(function (req, res) {
            User.findById(req.params.user_id, function (err, user) {
                if (err)
                    res.status(500).json({ success: false, message: "internal error when seeking user", error: err });
                else {
                    var friendExist = false;
                    user.friendsList.forEach(function (friend) {
                        if (friend.username == req.body.friendUsername)
                            friendExist = true;
                    });
                    if (friendExist)
                        res.status(403).json({ success: false, message: "friend already exist" });
                    else {
                        User.findByUsername(req.body.friendUsername, function (err, userArr) {
                            var friendToAdd = userArr[0];
                            var friend = { username: friendToAdd.username, id: friendToAdd._id };
                            user.friendsList.push(friend);
                            user.save(function (err) {
                                if (err)
                                    res.status(500).json({ success: false, message: "fail to add friend", error: err });
                                else
                                    res.status(201).json({ success: true, message: "friend added", friend: friend });
                            });

                        });
                    }
                }
            });
        })
    //delete a friend
        .delete(function (req, res) {
            User.findById(req.params.user_id, function (err, user) {
                if (err)
                    res.status(500).json({ success: false, message: "internal error when seeking user", error: err });
                else {
                    var friendExist = false;
                    var index;
                    user.friendsList.forEach(function (friend, i) {
                        if (friend.id == req.body.friendId) {
                            friendExist = true;
                            index = i;
                        }
                    });
                    if (friendExist) {
                        user.friendsList.splice(index, 1);
                        user.save(function (err) {
                            if (err)
                                res.status(500).json({ success: false, message: "fail to delete friend", error: err });
                            else
                                res.status(200).json({ success: true, message: "friend deleted" });
                        });
                    } else {
                        res.status(400).json({ success: false, message: "friend does not exist" });
                    }
                }
            });
        });

    router.route('/users/:user_id/location')
    //get location of the user
        .get(function (req, res) {
            User.findById(req.params.user_id, function (err, user) {
                if (err)
                    res.status(500).json({ success: false, message: "internal error when seeking user", error: err });
                else {
                    var loc = user.loc;
                    if (loc.broadcast)
                        res.status(200).json({ success: true, message: "location sent", location: loc });
                    else
                        res.status(403).json({ success: false, message: "private location" });
                }
            });
        })
        .put(function (req, res) {
            User.findById(req.params.user_id, function (err, user) {
                if (err)
                    res.status(500).json({ success: false, message: "internal error when seeking user", error: err });
                else {
                    user.loc = req.body.loc;
                    user.save(function (err) {
                        if (err)
                            res.status(500).json({ success: false, message: "fail to update location", error: err });
                        else
                            res.status(200).json({ success: true, message: "location updated" });
                    });
                }
            });
        });

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/v1/api', router);

};