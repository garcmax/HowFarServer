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


describe('Testing friends call', function () {

	this.timeout(5000);
	var usersArray;
	var user;
	var userToFriend;
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
				userToFriend = new User();
				userToFriend.username = 'userToFriend';
				userToFriend.password = bcrypt.hashSync('password');
				userToFriend.save(function (err) {
					User.findByUsername('userToFriend', function (err, users) {						
						userToFriend = users[0];
						done();
					});
				});
			});
		});
	});

	after(function (done) {
		User.collection.drop();
		done();
	});

	it('should add a friend', function (done) {
		chai.request(server)
			.put('/v1/api/users/' + user._id + '/friends')
			.set('Authorization', 'Bearer ' + token)
			.send({ friendUsername: userToFriend.username })
			.end(function (err, res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('success');
				res.body.success.should.equal(true);
				res.body.should.have.property('message');
				res.body.message.should.be.equal('friend added');
				res.body.should.have.property('friend');
				res.body.friend.should.be.a('object');
				res.body.friend.username.should.be.equal(userToFriend.username);
				done();
			});
	});
	it('should get all friends', function (done) {
		chai.request(server)
			.get('/v1/api/users/' + user._id + '/friends')
			.set('Authorization', 'Bearer ' + token)
			.end(function (err, res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('success');
				res.body.success.should.equal(true);
				res.body.should.have.property('friendList');
				res.body.friendList.should.be.a('array');
				res.body.friendList.length.should.be.equal(1);
				done();
			});
	});
	it('should delete userToFriend', function (done) {
		chai.request(server)
			.delete('/v1/api/users/' + user._id + '/friends')
			.set('Authorization', 'Bearer ' + token)
			.send({ friendId: userToFriend._id })
			.end(function (err, res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('success');
				res.body.success.should.equal(true);
				res.body.should.have.property('message');
				res.body.message.should.be.equal('friend deleted');
				done();
			});
	});
	it('should not find userToFriend to delete', function (done) {
		chai.request(server)
			.delete('/v1/api/users/' + user._id + '/friends')
			.set('Authorization', 'Bearer ' + token)
			.send({ friendId: userToFriend._id })
			.end(function (err, res) {
				res.should.have.status(400);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('success');
				res.body.success.should.equal(false);
				res.body.should.have.property('message');
				res.body.message.should.be.equal('friend does not exist');
				done();
			});
	});
});