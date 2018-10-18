const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, database } = require('../server');

chai.use(chaiHttp);

describe('BUILDING API ROUTES', () => {
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

  // should get all buildings
  it('GET /api/v1/buildings should return all buildings', (done) => {
    chai
      .request(app)
      .get('/api/v1/buildings')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('address');
        res.body[0].address.should.equal('1910 S Josephine St\nDenver, CO\n');
        res.body[0].should.have.property('name');
        res.body[0].name.should.equal('Modera Observatory Park');
        done();
      });
  });

  // should get an individual building
  it('GET /api/v1/buildings/:building_id should get a building by id', (done) => {
    chai
      .request(app)
      .get('/api/v1/buildings/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('address');
        res.body[0].address.should.equal('1910 S Josephine St\nDenver, CO\n');
        res.body[0].should.have.property('name');
        res.body[0].name.should.equal('Modera Observatory Park');
        done();
      });
  });

  // should return a 404 if the building is not found
  it('GET /api/v1/buildings/:building_id should return a 404 if the building id is not found', (done) => {
    chai
      .request(app)
      .get('/api/v1/buildings/600')
      .end((err, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('No building found with the id of 600.');
        done();
      });
  });

  // should create a new building
  it('POST /api/v1/buildings should create a new building', (done) => {
    chai
      .request(app)
      .post('/api/v1/buildings')
      .type('json')
      .send({
        address: '123 fake stree',
        name: 'Fake Building',
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.should.be.a('object');
        res.body.should.deep.equal({
          id: 241,
        });
        done();
      });
  });

  // should return a 409 if the building already exists
  it('POST /api/v1/buildings should return a 409 if the building already exists', (done) => {
    chai
      .request(app)
      .post('/api/v1/buildings')
      .type('json')
      .send({
        address: '1910 S Josephine St\nDenver, CO\n',
        name: 'Modera Observatory Park',
      })
      .end((err, res) => {
        res.should.have.status(409);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('That building already exists.');
        done();
      });
  });


  // should return a 422 if the a param is missing
  it('POST /api/v1/buildings should return a 422 if there is a missing param', (done) => {
    chai
      .request(app)
      .post('/api/v1/buildings')
      .type('json')
      .end((err, res) => {
        res.should.have.status(422);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Expected format: { name: <String>, address: <String> }. You\'re missing a "name" property.');
        done();
      });
  });

  // should update an existing building
  it('PUT /api/v1/buildings/:building_id should update an existing building', (done) => {
    chai
      .request(app)
      .put('/api/v1/buildings/1')
      .type('json')
      .send({
        address: '1910 S Josephine St\nDenver, CO\n',
        name: 'Modera Perrrrk',
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.deep.equal({
          id: 1,
        });
        done();
      });
  });

  // should return a 404 if a building with that id was not found
  it('PUT /api/v1/buildings/:building_id should return a 404 if the building was not found', (done) => {
    chai
      .request(app)
      .put('/api/v1/buildings/600')
      .type('json')
      .send({
        address: '1910 S Josephine St\nDenver, CO\n',
        name: 'Modera Perrrrk',
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Could not find building with id 600.');
        done();
      });
  });

  // should return a 422 if the correct params were not sent
  it('PUT /api/v1/buildings/:building_id should return a 422 if the correct params were not sent', (done) => {
    chai
      .request(app)
      .put('/api/v1/buildings/1')
      .type('json')
      .send({
        address: '1910 S Josephine St\nDenver, CO\n',
        cheese: 'cheddar',
      })
      .end((err, res) => {
        res.should.have.status(422);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Expected format: { name: <String>, address: <String> }. You\'re missing a "name" property.');
        done();
      });
  });

  // should delete a building
  it('DELETE /api/v1/buildings/:building_id delete a building', (done) => {
    chai
      .request(app)
      .delete('/api/v1/buildings/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.equal('Building 1 was successfully deleted.');
        done();
      });
  });

  // should return a 404 if the building was not found
  it('DELETE /api/v1/buildings/:building_id delete a building', (done) => {
    chai
      .request(app)
      .delete('/api/v1/buildings/600')
      .end((err, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Could not find building with id 600.');
        done();
      });
  });

  it('GET /api/v1/buildings/:building_id/users should return building users if response was ok', (done) => {
    chai
      .request(app)
      .get('/api/v1/buildings/1/users')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('name');
        res.body[0].name.should.equal('Gray Smith');
        done();
      });
  });

  it('GET /api/v1/buildings/:building_id/users should return a 404 if the building does not have any users', (done) => {
    chai
      .request(app)
      .get('/api/v1/buildings/123/users')
      .end((err, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Could not find any users with building id: 123.');
        done();
      });
  });

  it('GET /api/v1/buildings/:building_id/users should return only users with a certain interest if a query param is passed', (done) => {
    chai
      .request(app)
      .get('/api/v1/buildings/1/users?interest=golf')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('name');
        res.body[0].name.should.equal('Gray Smith');
        done();
      });
  });

  it('GET /api/v1/buildings/:building_id/users return a 404 if there was no users found with that interest', (done) => {
    chai
      .request(app)
      .get('/api/v1/buildings/1/users?interest=cheesemongering')
      .end((err, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Interest cheesemongering is not valid.');
        done();
      });
  });
});
