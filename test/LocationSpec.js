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


describe('Testing locations call', function () {

	this.timeout(5000);
	var usersArray;
	var user;
	var userToFriend;
	var token;
	var date = new Date();
	var location = {longitude: '48.8304239',
			latitude: '2.376587819',
			broadcast:true,
			date: date};

	before(function (done) {
		User.collection.drop();
		user = new User();
		user.username = 'username';
		user.password = bcrypt.hashSync('password');
		var loc = {longitude: '0',
			latitude: '0',
			broadcast: false,
			date: date};
		user.loc = loc;
		user.save(function (err) {
			if (err)
				console.log(err);
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

	/*after(function (done) {
		User.collection.drop();
		done();
	})*/

	it('should not broadcast location', function (done) {
		chai.request(server)
			.get('/v1/api/users/' + user._id + '/location')
			.set('Authorization', 'Bearer ' + token)
			.end(function (err, res) {
				res.should.have.status(403);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('success');
				res.body.success.should.equal(false);
				res.body.should.have.property('message');
				res.body.message.should.be.equal('private location');
				done();
			});
	});
	it('should update users location', function (done) {
		chai.request(server)
			.put('/v1/api/users/' + user._id + '/location')
			.set('Authorization', 'Bearer ' + token)
			.send({loc : location})
			.end(function (err, res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('success');
				res.body.success.should.equal(true);
				res.body.should.have.property('message');
				res.body.message.should.be.equal('location updated');
				done();
			});
	});
	it('should broadcast location', function (done) {
		chai.request(server)
			.get('/v1/api/users/' + user._id + '/location')
			.set('Authorization', 'Bearer ' + token)
			.end(function (err, res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('success');
				res.body.success.should.equal(true);
				res.body.should.have.property('message');
				res.body.message.should.be.equal('location sent');
				res.body.should.have.property('location');
				res.body.location.should.be.a('object');
				res.body.location.longitude.should.equal('48.8304239');
				done();
			});
	});
});