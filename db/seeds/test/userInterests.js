const userInterestData = require('../../../data/userInterestData.json');

exports.seed = function (knex) {
  return knex('user_interests').del()
    .then(() => knex('user_interests').insert(userInterestData))
    .catch(error => console.log(`Error seeding data: ${error}`));
};
