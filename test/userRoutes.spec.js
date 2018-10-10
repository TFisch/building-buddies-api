const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);

describe('USER API ROUTES', () => {
  it.only('GET / should return all users', (done) => {
    chai
      .request(server)
      .get('/api/v1/users/')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(8);
        res.body[0].should.have.property('name');
        res.body[0].name.should.equal('Gray Smith');
        res.body[0].should.have.property('building_id');
        res.body[0].building_id.should.equal(1);
        res.body[0].should.have.property('email');
        res.body[0].email.should.equal('gray.smith@gmail.com');
        res.body[0].should.have.property('password');
        res.body[0].password.should.equal('asdfasdf');
        done();
      });
  });

  it('GET /:id should return a user', (done) => {

  });

  it('POST / should create a new user', (done) => {

  });

  it('PUT /:user_id should update a user', (done) => {

  });

  it('DELETE /:user_id should delete a user', (done) => {

  });
});
