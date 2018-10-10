const userData = require('../../../userData.json');

exports.seed = function (knex) {
  return knex('users').del()
    .then(() => knex('users').insert(userData))
    .catch(error => console.log(`Error seeding data: ${error}`));
};
