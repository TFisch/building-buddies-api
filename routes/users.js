const express = require('express');

const router = express.Router();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

// get all users
router.get('/', (req, res) => {
  database('users')
    .select()
    .then((users) => {
      const usernames = users.map(user => user.name);
      res.status(200).json(usernames);
    })
    .catch(err => res.status(500).json({ err }));
});

// create a new users
router.post('/register', (req, res) => {
  const {
 name, email, building_id, password 
} = req.body;

  const requiredParams = ['name', 'email', 'building_id'];
  const newUser = {
    name,
    email,
    password,
    building_id,
  };

  requiredParams.map((param) => {
    if (!newUser[param]) {
      return res.status(422).send({
        error: `Expected format: { name: <String>, email: <String>, password: <String>, building_id: <Integer> }. You're missing a "${param}" property.`,
      });
    }
  });

  database('users')
    .where('email', newUser.email)
    .then((response) => {
      if (response.length > 0) {
        return res
          .status(409)
          .send({ error: 'An account with that email already exists.' });
      }
      return database('users')
        .insert(newUser, 'id')
        .then(user => res.status(201).json({ id: user[0] }))
        .catch(err => res.status(500).json({ err }));
    })
    .catch(err => res.status(500).json({ err }));
});

module.exports = router;
