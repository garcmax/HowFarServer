var User = require('./models/user');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(app, express) {
   // ROUTES FOR OUR API
   // =============================================================================
   var router = express.Router();              // get an instance of the express Router

    // middleware to use for all requests
    router.use(function(req, res, next) {
        // do logging
        // if (req) {
        //     console.log("req : ");
        //     console.log(req.body);
        // }
        next(); // make sure we go to the next routes and don't stop here
    });


   // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
   router.get('/', function(req, res) {
       res.json({ message: 'hooray! welcome to our api!' });
   });

   // more routes for our API will happen here

   //log the user
    router.route('/login')
        .post(function(req, res) {
            User.findByUsername(req.body.username, function (err, userArr) {         
                if (err) {
                    res.status(500).send({error : "login server error"});
                    return;
                }
                if(userArr.length == 0) {
                    res.status(401).send({error : "bad credentials"});
                    return;
                }
                var user = userArr[0];
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    res.location('/users/' + user._id);
                    res.status(200).send({success : "logged"});
                }
                else
                    res.status(401).send({error : "bad credentials"});
                });
        });

    //register the user
    router.route('/register')
        .post(function(req, res) {
            var body = req.body;
            if (body.username.length < 3 || body.password.length < 4) {
                res.status(400).send({error : "username or password too short"});
                return;
            }
            var user = new User();
            user.username = req.body.username;
            user.password = bcrypt.hashSync(req.body.password);
            user.save(function(err) {
                if (err)
                    res.status(500).send({error : "fail to register"});
                else {
                    res.location('/users/' + user._id);
                    res.status(201).send({success : "user created"});
                }
            });
        });

    //get all users
    router.route('/users')
        .get(function(req, res) {
            User.find(function(err, users) {
                if (err)
                    res.status(500).send({error : "fail to get users"});
                res.json(users);
            });
        });


    router.route('/users/:user_id')
        //get one user from his id
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err)
                    res.status(500).send({error : "fail to get user"});
                res.json(user);
            })
        })
        //update the login of a user
        .put(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err)
                    res.send(err);
                user.username = req.body.username;
                user.save(function (err) {
                    if (err)
                        res.status(500).send({error : "fail to change username"});
                    else
                        res.status(200).send({success : "username changed"});
                });
            });
        });


    router.route('/users/:user_id/friends')
        //get all friends
        .get(function (req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err)
                    res.status(500).send({error : "fail to get friends"});
                res.json(user.friendsList);
            });
        })
        //add a friend
        .put(function (req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err)
                    res.status(404).send({error : "user not found"});
                else {
                    var friendExist = false;
                    user.friendsList.forEach(function(friend) {
                        if (friend.friendId == req.body.friendId)
                            friendExist = true;
                    });
                    if (friendExist)
                        res.status(403).send({error : "friend already exist"});
                    else {
                        user.friendsList.push(req.body);
                        user.save(function (err) {
                            if (err)
                                res.status(500).send({error : "fail to add friend"});
                            else
                                res.status(201).send({success : "friend added"});
                        })
                    }
                }
            });
        })
        //delete a friend
        .delete(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err)
                    res.status(404).send({error : "user not found"});
                else {
                    var friendExist = false;
                    var index;
                    user.friendsList.forEach(function(friend, i) {
                        if (friend.friendId == req.body.friendId) {
                            friendExist = true;
                            index = i;
                        }
                    });
                    if (friendExist) {
                        user.friendsList.splice(index, 1);
                        user.save(function (err) {
                            if (err)
                                res.status(500).send({error : "fail to delete friend"});
                            else
                                res.status(200).send({success : "friend deleted"});
                        });
                    } else {
                        res.status(404).send({error : "friend not found"});
                    }
                }
            });
        });

   // REGISTER OUR ROUTES -------------------------------
   // all of our routes will be prefixed with /api
   app.use('/api', router);

}