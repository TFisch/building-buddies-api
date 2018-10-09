const express = require('express');

const router = express.Router();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

// get all buildings
router.get('/', (req, res) => {
  database('buildings')
    .select()
    .then(buildings => res.status(200).json(buildings))
    .catch(err => res.status(500).json({ err }));
});

// create new building
router.post('/', (req, res) => {
  const { name, address } = req.body;
  const requiredParams = ['name', 'address'];

  requiredParams.map((param) => {
    if (!req.body[param]) {
      return res.status(422).send({
        error: `Expected format: { name: <String>, address: <String> }. You're missing a "${param}" property.`,
      });
    }
    return param;
  });

  database('buildings')
    .where('name', name)
    .then((response) => {
      if (response.length > 0) {
        return res.status(409).send({ error: 'That building already exists.' });
      }
      return database('buildings')
        .insert({ name, address }, 'id')
        .then(building => res.status(201).json({ id: building[0] }))
        .catch(err => res.status(500).json({ err }));
    })
    .catch(err => res.status(500).json({ err }));
});

// delete building
router.delete('/:building_id', (req, res) => {
  const { building_id } = req.params;

  database('buildings')
    .where('id', building_id)
    .del()
    .then(() => res.status(204))
    .catch(err => res.status(500).json({ err }));
});

module.exports = router;
