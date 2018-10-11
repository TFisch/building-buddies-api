const express = require('express');
const { validateUserParams } = require('../middlewares/validations');

const router = express.Router();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

// get all users
router.get('/', (req, res) => {
  // find users with a certain interest
  if (req.param('interest')) {
    const interest_name = req.param('interest');
    return database('interests')
      .where('name', interest_name)
      .then((interest) => {
        if (!interest.length) {
          return res.status(404).json({ error: `Interest ${interest_name} is not valid.` });
        }
        database('user_interests')
          .where('interest_id', interest[0].id)
          .then((userInterests) => {
            const userPromises = userInterests.map(userInterest => database('users')
              .where('id', userInterest.user_id)
              .then(user => user[0].name));

            return Promise.all(userPromises);
          })
          .then(allUsers => res.status(200).json(allUsers));
      })
      .catch(err => res.status(500).json({ err }));
  }

  database('users')
    .select()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ err }));
});

// get user by id
router.get('/:user_id', (req, res) => {
  database('users')
    .where('id', req.params.user_id)
    .select()
    .then((user) => {
      if (user.length) {
        return res.status(200).json(user[0]);
      }
      return res.status(404).json({ error: `No user with the id of ${req.params.user_id} was found.` });
    })
    .catch(err => res.status(500).json({ err }));
});

// create a new user
router.post('/', validateUserParams, (req, res) => {
  const {
    name, email, building_id, password,
  } = req.body;

  const newUser = {
    name,
    email,
    password,
    building_id,
  };

  database('users')
    .where('email', newUser.email)
    .then((response) => {
      if (response.length > 0) {
        return res
          .status(409)
          .json({ error: 'An account with that email already exists.' });
      }
      database('users')
        .insert(newUser, 'id')
        .then(user => res.status(201).json({ id: user[0] }))
        .catch(err => res.status(500).json({ err }));
    })
    .catch(err => res.status(500).json({ err }));
});

// update user
router.put('/:user_id', validateUserParams, (req, res) => {
  const { user_id } = req.params;
  const updatedUser = req.body;

  database('users')
    .where('id', user_id)
    .update(updatedUser)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: `Could not find user with id: ${user_id}.` });
      }
      return res.status(200).json({ id: user });
    });
});

// delete user
router.delete('/:user_id', (req, res) => {
  const { user_id } = req.params;

  database('users')
    .where('id', user_id)
    .select()
    .del()
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: `Could not find user with id ${user_id}.` });
      }
      return res.status(200).send(`User ${user_id} was successfully deleted`);
    });
});

// add user interest
router.post('/:user_id/interests/:interest_id', (req, res) => {
  const { user_id, interest_id } = req.params;

  database('user_interests')
    .where('user_id', user_id)
    .where('interest_id', interest_id)
    .then((userInterest) => {
      if (userInterest.length) {
        return res.status(409).json({ error: 'Interest is already saved for this user.' });
      }
      return database('user_interests')
        .insert({ user_id, interest_id }, 'id')
        .then(newUserInterest => res.status(201).json({ id: newUserInterest[0] }))
        .catch(err => res.status(500).json({ err }));
    })
    .catch(err => res.status(500).json({ err }));
});

// delete user interest
router.delete('/:user_id/interests/:interest_id', (req, res) => {
  const { user_id, interest_id } = req.params;

  database('user_interests')
    .where('user_id', user_id)
    .where('interest_id', interest_id)
    .then((userInterest) => {
      if (!userInterest.length) {
        return res.status(404).json({ error: 'Could not find a matching user interest.' });
      }
      return database('user_interests')
        .where('id', userInterest[0].id)
        .del()
        .then(() => res.status(200).send(`Interest ${interest_id} was successfully deleted for user ${user_id}.`))
        .catch(err => res.status(500).json({ err }));
    })
    .catch(err => res.status(500).json({ err }));
});

// get all user interests
router.get('/:user_id/interests', (req, res) => {
  const { user_id } = req.params;

  database('user_interests')
    .where('user_id', user_id)
    .then((userInterests) => {
      if (!userInterests.length) {
        return res.status(404).json({ error: `Could not find interests for user ${user_id}` });
      }

      const interests = userInterests.map(interest => database('interests')
        .where('id', interest.interest_id)
        .then(foundInterest => foundInterest[0].name)
        .catch(err => res.status(500).json({ err })));

      return Promise.all(interests);
    })
    .then(interests => res.status(200).json(interests))
    .catch(err => res.status(500).json({ err }));
});

module.exports = router;
