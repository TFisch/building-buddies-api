const express = require('express');
const { validateInterestParam } = require('../middlewares/validations');
const { app, database } = require('../server');

const router = express.Router();

// get all interests
router.get('/', (req, res) => {
  database('interests')
    .select()
    .then(interests => res.status(200).json(interests))
    .catch(err => res.status(500).json({ err }));
});

// create new interest
router.post('/', validateInterestParam, (req, res) => {
  const { name } = req.body;
  const newInterest = { name: name.toLowerCase() };

  database('interests')
    .where('name', newInterest.name)
    .then((response) => {
      if (response.length > 0) {
        return res.status(409).send({
          error: 'That interest already exists.',
        });
      }
      return database('interests')
        .insert(newInterest, 'id')
        .then(interest => res.status(201).json({ id: interest[0] }))
        .catch(err => res.status(500).json({ err }));
    })
    .catch(err => res.status(500).json({ err }));
});

module.exports = router;
