const apartmentData = require('../../../data/apartmentData.json');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('user_interests').del()
    .then(() => knex('users').del())
    .then(() => knex('buildings').del())
    .then(() => (
      // Inserts seed entries
      knex('buildings').insert(apartmentData)
    ))
    .catch(error => console.log(`Error seeding data: ${error}`));
};
