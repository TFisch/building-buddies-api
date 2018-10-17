const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const { app, database } = require('../server');

chai.use(chaiHttp);

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
      .request(app)
      .get('/api/v1/users')
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

  // it should get all the users with a specific interest
  it('GET /api/v1/users?interest=:interest_name should get all the users with a certain interest', (done) => {
    chai
      .request(app)
      .get('/api/v1/users?interest=golf')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.be.a('string');
        res.body[0].should.equal('Gray Smith');
        done();
      });
  });

  // it should return a 404 if no interest with that name is found
  it('GET /api/v1/users?interes=:interest_name should return a 404 if no interest with that name is found', (done) => {
    chai
      .request(app)
      .get('/api/v1/users?interest=cheesemongering')
      .end((err, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.deep.equal({
          error: 'Interest cheesemongering is not valid.',
        });
        done();
      });
  });

  it('GET /:id should return a user', (done) => {
    chai
      .request(app)
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
      .request(app)
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
      .request(app)
      .post('/api/v1/users')
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
      .request(app)
      .post('/api/v1/users')
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
      .request(app)
      .put('/api/v1/users/1')
      .send({
        name: 'Gray Smithers',
        email: 'gray.smith@gmail.com',
        password: 'asdfasdf',
        building_id: 1,
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

  it('PUT /:user_id should send an error if it doesn\'t have accepted params', (done) => {
    chai
      .request(app)
      .put('/api/v1/users/1')
      .send({
        email: 'gray.smith@gmail.com',
        password: 'asdfasdf',
        building_id: 1,
      })
      .end((err, res) => {
        res.should.have.status(422);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.error.should.equal('Expected format: { name: <String>, email: <String>, password: <String>, building_id: <Integer> }. You\'re missing a "name" property.');
        done();
      });
  });

  it('PUT /:user_id should send an error if user doesn\'t exist', (done) => {
    chai
      .request(app)
      .put('/api/v1/users/500')
      .send({
        name: 'Gray Smithers',
        email: 'gray.smith@gmail.com',
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
      .request(app)
      .delete('/api/v1/users/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('User 1 was successfully deleted.');
        done();
      });
  });

  it('DELETE /:user_id should send an error if user doesn\'t exist', (done) => {
    chai
      .request(app)
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
      .request(app)
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

  it('POST /:user_id/interests/:interest_id should send an error if user already has that interest', (done) => {
    chai
      .request(app)
      .post('/api/v1/users/1/interests/3')
      .end((err, res) => {
        res.should.have.status(409);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Interest is already saved for this user.');
        done();
      });
  });

  it('DELETE /:user_id/interests/:interest_id should delete a user interest', (done) => {
    chai
      .request(app)
      .delete('/api/v1/users/1/interests/3')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('message');
        res.body.message.should.equal('Interest 3 was successfully deleted for user 1.');
        done();
      });
  });

  it('DELETE /:user_id/interests/:interest_id should send an error if there is no matching user interest', (done) => {
    chai
      .request(app)
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

  it('GET /:user_id/interests should get all user interests', (done) => {
    chai
      .request(app)
      .get('/api/v1/users/1/interests')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(3);
        res.body[0].should.be.a('object');
        res.body[0].name.should.equal('golf');
        res.body[0].id.should.equal(1);
        done();
      });
  });

  it('GET /:user_id/interests should send an error if user has no interests', (done) => {
    chai
      .request(app)
      .get('/api/v1/users/5/interests')
      .end((err, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Could not find interests for user 5');
        done();
      });
  });
});
