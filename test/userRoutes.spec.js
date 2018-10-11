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

  it('PUT /:user_id should update a user', (done) => {
    chai
      .request(server)
      .put('/api/v1/users/1')
      .send({
        name: 'Gray Smithers'
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.id.should.be.a('number');
        done();
      });
  });

  it('PUT /:user_id should send an error if it doesn\'t have an accepted param', (done) => {
    chai
      .request(server)
      .put('/api/v1/users/1')
      .send({
        name: 'Gray Smith',
        incorrectKey: 'asdfasdf',
        building_id: 1,
      })
      .end((err, res) => {
        res.should.have.status(422);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.error.should.equal('Looks like you are using unaccepted parameters.');
        done();
      });
  });

  it('PUT /:user_id should send an error if user doesn\'t exist', (done) => {
    chai
      .request(server)
      .put('/api/v1/users/500')
      .send({
        name: 'Gray Smith',
        password: 'asdfasdf',
        building_id: 1,
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Could not find user with id: 500.');
        done();
      });
  });

  it('DELETE /:user_id should delete a user', (done) => {
    chai
      .request(server)
      .delete('/api/v1/users/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.html;
        res.text.should.equal('User 1 was successfully deleted');
        done();
      });
  });

  it('DELETE /:user_id should send an error if user doesn\'t exist', (done) => {
    chai
      .request(server)
      .delete('/api/v1/users/500')
      .end((err, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Could not find user with id 500.');
        done();
      });
  });

  it('POST /:user_id/interests/:interest_id should add a user interest', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/1/interests/4')
      .end((err, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.id.should.be.a('number');
        done();
      });
  });

  // Need to seed user interests
  // Add specific error if user or interest id does not exist
  it.skip('POST /:user_id/interests/:interest_id should send an error if user already has that interest', (done) => {
    chai
      .request(server)
      .post('/api/v1/users/1/interests/4')
      .end((err, res) => {
        res.should.have.status(409);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Interest is already saved for this user.');
        done();
      });
  });

  it.skip('DELETE /:user_id/interests/:interest_id should add a user interest', (done) => {
    chai
      .request(server)
      .delete('/api/v1/users/1/interests/4')
      .end((err, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.id.should.be.a('number');
        done();
      });
  });

  it('DELETE /:user_id/interests/:interest_id should send an error if there is no matching user interest', (done) => {
    chai
      .request(server)
      .delete('/api/v1/users/1/interests/4')
      .end((err, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Could not find a matching user interest.');
        done();
      });
  });
});
