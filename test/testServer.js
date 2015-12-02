var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/server');
var should = chai.should();
var config = require("../config/db");

chai.use(chaiHttp);


describe('Testing call on users', function() {
    this.timeout(10000);
    
    
  it('should list ALL users on /users GET', function(done) {
      chai.request(server)
      .get('/api/users')
      .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          done();
      });
      
  });
});