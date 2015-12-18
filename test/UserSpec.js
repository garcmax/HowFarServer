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


describe('Testing user call', function () {

	this.timeout(5000);
	var usersArray;
	var user;
	var token;

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
					expiresIn: config.jwt.expire
				});
				done();
			});
		});
	});

	/*after(function (done) {
		User.collection.drop();
		done();
	})*/

	it('should get all users', function (done) {
		chai.request(server)
			.get('/v1/api/users')
			.set('Authorization', 'Bearer ' + token)
			.end(function (err, res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('success');
				res.body.success.should.equal(true);
				res.body.should.have.property('users');
				res.body.users.should.be.a('array');
				res.body.users.length.should.be.equal(usersArray.length);
				done();
			});
	});
	it('should get user : user', function (done) {
		chai.request(server)
			.get('/v1/api/users/' + user._id)
			.set('Authorization', 'Bearer ' + token)
			.end(function (err, res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('success');
				res.body.success.should.equal(true);
				res.body.user.username.should.be.equal(user.username);
				done();
			});
	});
	it('should change username of user with newUser', function (done) {
		chai.request(server)
			.put('/v1/api/users/' + user._id + '/username')
			.set('Authorization', 'Bearer ' + token)
			.send({ username: 'newUser' })
			.end(function (err, res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('success');
				res.body.success.should.equal(true);
				res.body.should.have.property('message');
				res.body.message.should.equal('username changed');
				chai.request(server)
					.get('/v1/api/users/' + user._id)
					.set('Authorization', 'Bearer ' + token)
					.end(function (err, res) {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('object');
						res.body.should.have.property('success');
						res.body.success.should.equal(true);
						res.body.user.username.should.be.equal('newUser');
						done();
					});
			});
	});
	it('should check if a user exist');
	it('should change the password user with : newPassword');
});