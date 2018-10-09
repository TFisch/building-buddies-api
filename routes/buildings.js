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
  const newBuilding = { name, address };
  console.log(newBuilding);
  const requiredParams = ['name', 'address'];

  requiredParams.map((param) => {
    if (!newBuilding[param]) {
      return res.status(422).send({
        error: `Expected format: { name: <String>, address: <String> }. You're missing a "${param}" property.`,
      });
    }
  });

  database('buildings')
    .insert(newBuilding, 'id')
    .then(building => res.status(201).json({ id: building[0] }))
    .catch(err => res.status(500).json({ err }));
});

module.exports = router;
