process.env.NODE_ENV = 'test';
  
var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var server = require('../server/server');
var should = chai.should();
var config = require("../config/serverConfig");
var User = require('../app/models/user');

chai.use(chaiHttp);


describe('Testing login and register', function() {

  this.timeout(10000);
  User.collection.drop();

  // beforeEach(function(done){
  //   var user = new User();
  //     user.username = 'user';
  //     user.password = bcrypt.hashSync('password');
  //   user.save(function(err) {
  //     if (err)
  //       console.log(err);
  //     done();
  //   });
  // });
  // afterEach(function(done){
  //   User.collection.drop();
  //   done();
  // });
    
  it('should register user : user/password', function(done) {
    chai.request(server)
      .post('/api/register').send({username:"user", password: "password"})
      .end(function(err, res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('success');
          res.body.success.should.equal('user created')
          done();
      });
  });
  it('should login the user : user/password', function(done) {
      chai.request(server)
      .post('/api/login').send({username:"user", password: "password"})
      .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('success');
          res.body.success.should.equal('logged')
          done();
      });
  });
  it('should not logged user : user/badpwd', function(done) {
    chai.request(server)
      .post('/api/login').send({username:"user", password: "badpwd"})
      .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.equal('bad credentials')
          done();
      });
  });
  it('should not logged user : baduser/password', function(done) {
    chai.request(server)
      .post('/api/login').send({username:"baduser", password: "password"})
      .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.equal('bad credentials')
          done();
      });
  });
  it('should register user : username very long with space/password very long with space', function(done) {
    chai.request(server)
      .post('/api/register').send({username:"username very long with space", password: "password very long with space"})
      .end(function(err, res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('success');
          res.body.success.should.equal('user created')
          done();
      });
  });
  it('should login the user : username very long with space/password very long with space', function(done) {
      chai.request(server)
      .post('/api/login').send({username:"username very long with space", password: "password very long with space"})
      .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('success');
          res.body.success.should.equal('logged')
          done();
      });
  });
  it('should register user : ù$3rnâmè/p4$$wörd', function(done) {
    chai.request(server)
      .post('/api/register').send({username:"ù$3rnâmè", password: "p4$$wörd"})
      .end(function(err, res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('success');
          res.body.success.should.equal('user created')
          done();
      });
  });
  it('should login the user : ù$3rnâmè/p4$$wörd', function(done) {
      chai.request(server)
      .post('/api/login').send({username:"ù$3rnâmè", password: "p4$$wörd"})
      .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('success');
          res.body.success.should.equal('logged')
          done();
      });
  });
  it('should not register user : us/password', function(done) {
    chai.request(server)
      .post('/api/register').send({username:"us", password: "password"})
      .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.equal('username or password too short')
          done();
      });
  });
  it('should not register user : user1/pwd', function(done) {
    chai.request(server)
      .post('/api/register').send({username:"user1", password: "pwd"})
      .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.equal('username or password too short')
          done();
      });
  });
});