const apartmentData = require('../../../apartmentData.json');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('userInterests').del()
    .then(() => knex('users').del()) 
    .then(() => knex('buildings').del()) 
    .then(function () {
      // Inserts seed entries
      return knex('buildings').insert(apartmentData);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};