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


describe('Testing login and register API', function () {

  this.timeout(5000);


  before(function (done) {
    User.collection.drop();
    done();
  });

  /*after(function (done) {
     User.collection.drop();
     done();
   })*/

  it('should register and log user : user/password', function (done) {
    chai.request(server)
      .post('/v1/api/register').send({ username: "user", password: "password" })
      .end(function (err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(true);
        res.body.should.have.property('message');
        res.body.message.should.equal('user created');
        res.body.should.have.property('token');
        var token = res.body.token;
        jwt.verify(token, config.jwt.secret, function (err, decoded) {
          if (err)
            console.log(err);
          else {
            decoded.iss.should.equal(config.jwt.issuer);
          }
        });
        chai.request(server)
          .post('/v1/api/login').send({ username: "user", password: "password" })
          .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.success.should.equal(true);
            res.body.should.have.property('message');
            res.body.message.should.equal('logged');
            done();
          });
      });
  });
  it('should not register user : user/password because of duplicate username', function (done) {
    chai.request(server)
      .post('/v1/api/register').send({ username: "user", password: "password" })
      .end(function (err, res) {
        res.should.have.status(500);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('fail to register');
        res.body.should.have.property('error');
        res.body.error.code.should.equal(11000);
        done();
      });
  });
  it('should not logged user : user/badpwd', function (done) {
    chai.request(server)
      .post('/v1/api/login').send({ username: "user", password: "badpwd" })
      .end(function (err, res) {
        res.should.have.status(401);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('bad credentials');
        done();
      });
  });
  it('should not logged user : baduser/password', function (done) {
    chai.request(server)
      .post('/v1/api/login').send({ username: "baduser", password: "password" })
      .end(function (err, res) {
        res.should.have.status(401);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('bad credentials');
        done();
      });
  });
  it('should register and log user : username very long with space/password very long with space', function (done) {
    chai.request(server)
      .post('/v1/api/register').send({ username: "username very long with space", password: "password very long with space" })
      .end(function (err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(true);
        res.body.should.have.property('message');
        res.body.message.should.equal('user created');
        chai.request(server)
          .post('/v1/api/login').send({ username: "username very long with space", password: "password very long with space" })
          .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.success.should.equal(true);
            res.body.should.have.property('message');
            res.body.message.should.equal('logged');
            done();
          });
      });
  });
  it('should register user : ù$3rnâmè/p4$$wörd', function (done) {
    chai.request(server)
      .post('/v1/api/register').send({ username: "ù$3rnâmè", password: "p4$$wörd" })
      .end(function (err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(true);
        res.body.should.have.property('message');
        res.body.message.should.equal('user created');
        chai.request(server)
          .post('/v1/api/login').send({ username: "ù$3rnâmè", password: "p4$$wörd" })
          .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.success.should.equal(true);
            res.body.should.have.property('message');
            res.body.message.should.equal('logged');
            done();
          });
      });
  });
  it('should not register user : us/password', function (done) {
    chai.request(server)
      .post('/v1/api/register').send({ username: "us", password: "password" })
      .end(function (err, res) {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('username or password too short');
        done();
      });
  });
  it('should not register user : user1/pwd', function (done) {
    chai.request(server)
      .post('/v1/api/register').send({ username: "user1", password: "pwd" })
      .end(function (err, res) {
        res.should.have.status(400);
        res.should.be.json;
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('username or password too short');
        done();
      });
  });
});