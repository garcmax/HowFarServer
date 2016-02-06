process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

var server = require('../server/server');
var should = chai.should();
var config = require("../config/serverConfig");
var User = require('../app/models/user');


chai.use(chaiHttp);


describe('Testing renewal of token', function () {

	this.timeout(5000);
	var usersArray;
	var user;
	var token;
	var ttl = 1;

	before(function (done) {
		User.collection.drop();
		user = new User();
		user.username = 'username';
		user.password = bcrypt.hashSync('password');
		user.save(function (err) {
			User.find(function (err, users) {
				usersArray = users;
				user = users[0];
				token = jwt.sign({}, config.jwt.secret, {
					issuer: config.jwt.issuer,
					audience: user._id,
					expiresIn: ttl
				});
                setTimeout(function () {
				    done();
                }, 2000);
			});
		});
	});

	it('should renew the token', function (done) {
        chai.request(server)
            .get('/v1/api/users')
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
	});
});