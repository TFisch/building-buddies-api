const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const interestData = require('../data/interestData.json');

chai.use(chaiHttp);

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('INTEREST API ROUTES', () => {
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

  // it should return all the interests
  it('GET /api/v1/interests should return all interests', (done) => {
    chai
      .request(server)
      .get('/api/v1/interests')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('name');
        res.body[0].name.should.equal('golf');
        res.body[0].should.have.property('id');
        res.body[0].id.should.equal(1);
        done();
      });
  });

  // it should create a new interest
  it('POST /api/v1/interests should create a new interest', (done) => {
    chai
      .request(server)
      .post('/api/v1/interests')
      .type('json')
      .send({
        name: 'tennis',
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.deep.equal({
          id: 15,
        });
        done();
      });
  });

  // should return a 422 if the correct params were not sent
  it('POST /api/v1/interests should return a 422 if the correct params were not sent', (done) => {
    chai
      .request(server)
      .post('/api/v1/interests')
      .type('json')
      .send({
        skills: 'cheese mongering',
      })
      .end((err, res) => {
        res.should.have.status(422);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Expected format: { name: <String> }. You\'re missing a name property.')
        done();
      });
  });

  // should return a 409 if the interst already exists
  it('POST /api/v1/interests should return a 409 if the interest already exists', (done) => {
    chai
      .request(server)
      .post('/api/v1/interests')
      .type('json')
      .send({
        name: 'golf',
      })
      .end((err, res) => {
        res.should.have.status(409);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('That interest already exists.');
        done();
      });
  });


  // should return all users with a certain interest
});
