const interestData = require('../../../data/interestData.json');

exports.seed = function (knex) {
  return knex('interests').del()
    .then(() => knex('interests').insert(interestData))
    .catch(error => console.log(`Error seeding data: ${error}`));
};
