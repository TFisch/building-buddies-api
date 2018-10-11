const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('USER API ROUTES', () => {
  beforeEach((done) => {
    database.migrate.rollback()
      .then(() => {
        database.migrate.latest()
          .then(() => database.seed.run()
            .then(() => {
              done();
            }));
      });
  });

  it('GET / should return all users', (done) => {
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
    chai
      .request(server)
      .get('/api/v1/users/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('name');
        res.body.name.should.equal('Gray Smith');
        res.body.should.have.property('building_id');
        res.body.building_id.should.equal(1);
        res.body.should.have.property('email');
        res.body.email.should.equal('gray.smith@gmail.com');
        res.body.should.have.property('password');
        res.body.password.should.equal('asdfasdf');
        done();
      });
  });

  it('GET /:id should send an error if user doesn\'t exist', (done) => {
    chai
      .request(server)
      .get('/api/v1/users/500')
      .end((err, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('No user with the id of 500 was found.');
        done();
      });
  });

  it('POST / should create a new user', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/')
      .send({
        name: 'Test',
        email: 'test@test.com',
        password: 'asdfasdf',
        building_id: 1,
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.id.should.be.a('number');
        done();
      });
  });

  it('POST / should send an error if params don\'t match', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/')
      .send({
        name: 'Test',
        password: 'asdfasdf',
        building_id: 1,
      })
      .end((err, res) => {
        res.should.have.status(422);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Expected format: { name: <String>, email: <String>, password: <String>, building_id: <Integer> }. You\'re missing a "email" property.');
        done();
      });
  });

});
