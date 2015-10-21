var User = require('./models/user');
var path = require('path');

module.exports = function(app, express) {
   // ROUTES FOR OUR API
   // =============================================================================
   var router = express.Router();              // get an instance of the express Router

    // middleware to use for all requests
    router.use(function(req, res, next) {
        // do logging
        console.log(req.body);
        next(); // make sure we go to the next routes and don't stop here
    });


   // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
   router.get('/', function(req, res) {
       res.json({ message: 'hooray! welcome to our api!' });
   });

   // more routes for our API will happen here
    router.route('/login')
        .post(function(req, res) {
            User.findOne(req.body.login, function (err, user) {
                if (user.password != req.body.password)
                    res.status(401).json({error : 'bad login'});
                else {
                    res.location('/users/' + user._id);
                    res.status(201).send(null);
                }
            });
        });


    //create a new user and get them all
    router.route('/users')
        .post(function(req, res) {
            var user = new User();
            user.login = req.body.login;
            user.password = req.body.password;

            user.save(function(err) {
                if (err)
                    res.send(err);
                else {
                    res.location('/users/' + user._id);
                    res.status(201).send(null);
                }
            });
        })
        .get(function(req, res) {
            User.find(function(err, users) {
                if (err)
                    res.send(err);
                res.json(users);
            });
        });


    router.route('/users/:user_id')
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err)
                    res.send(err);
                res.json(user);
            })
        });

   // REGISTER OUR ROUTES -------------------------------
   // all of our routes will be prefixed with /api
   app.use('/api', router);

}