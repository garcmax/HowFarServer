process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken')

var server = require('../server/server');
var should = chai.should();
var config = require("../config/serverConfig");
var User = require('../app/models/user');


chai.use(chaiHttp);


describe('Testing user call', function () {

	this.timeout(2000);	
	var userToTest;
	var token;
	
	before(function (done) {
		User.find(function (err, users) {
			userToTest = users[0];
			token = jwt.sign({}, config.jwt.secret, {
				issuer: config.jwt.issuer,
				audience: userToTest._id,
				expiresIn: config.jwt.expire
			});
			done();
		});
	});


	it('should get all users', function (done) {
		chai.request(server)
			.get('/api/users')
			.set('Authorization', 'Bearer ' + token)
			.end(function (err, res) {				
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('success');
				res.body.success.should.equal(true);
				res.body.should.have.property('users');
				res.body.users.should.be.a('array');
				res.body.users.length.should.be.equal(3);
				done();
			});
	});
	it('should get user : user', function (done) {
		chai.request(server)
			.get('/api/users/' + userToTest._id)
			.set('Authorization', 'Bearer ' + token)
			.end(function (err, res) {				
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('success');
				res.body.success.should.equal(true);
				res.body.user.username.should.be.equal(userToTest.username);
				done();
			});
	});
	it('should change username of user with newUser', function (done) {
		chai.request(server)
			.put('/api/users/' + userToTest._id + '/username')
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
					.get('/api/users/' + userToTest._id)
					.set('Authorization', 'Bearer ' + token)
					.end(function (err, res) {
						res.body.user.username.should.be.equal('newUser');
						done();
					});
			});
	});
	it('should change the password user with : newPassword');
});