const express = require('express');
const { validateBuildingParams } = require('../middlewares/validations');
const { app, database } = require('../server');
const router = express.Router();

// get all buildings
router.get('/', (req, res) => {
  database('buildings')
    .select()
    .then(buildings => res.status(200).json(buildings))
    .catch(err => res.status(500).json({ err }));
});

router.get('/:building_id', (req, res) => {
  const { building_id } = req.params;

  database('buildings')
    .where('id', building_id)
    .select()
    .then((buildings) => {
      if (!buildings.length) {
        return res.status(404).json({ error: `No building found with the id of ${building_id}.` });
      }
      return res.status(200).json(buildings);
    })
    .catch(err => res.status(500).json({ err }));
});

// create new building
router.post('/', validateBuildingParams, (req, res) => {
  const { name, address } = req.body;
  const newBuilding = { name, address };

  database('buildings')
    .where('name', name)
    .then((response) => {
      if (response.length > 0) {
        return res.status(409).json({ error: 'That building already exists.' });
      }
      return database('buildings')
        .insert(newBuilding, ['id', 'name', 'address'])
        .then(building => res.status(201).json(building[0]))
        .catch(err => res.status(500).json({ err }));
    })
    .catch(err => res.status(500).json({ err }));
});

// edit existing building
router.put('/:building_id', validateBuildingParams, (req, res) => {
  const { building_id } = req.params;
  const { name, address } = req.body;
  const buildingData = { name, address };

  database('buildings')
    .where('id', building_id)
    .update(buildingData, ['id', 'name', 'address'])
    .then((buildingId) => {
      if (buildingId === 0) {
        return res.status(404).json({
          error: `Could not find building with id ${building_id}.`,
        });
      }
      return res.status(200).json(buildingId[0]);
    })
    .catch(err => res.status(500).json({ err }));
});

// delete building
router.delete('/:building_id', (req, res) => {
  const { building_id } = req.params;

  database('buildings')
    .where('id', building_id)
    .select()
    .then((building) => {
      if (building.length) {
        database('buildings')
          .where('id', building_id)
          .del()
          .then(() => res.status(200).json({ message: `Building ${building_id} was successfully deleted.` }))
          .catch(err => res.status(500).json({ err }));
      } else {
        return res.status(404).json({ error: `Could not find building with id ${building_id}.` });
      }
    })
    .catch(err => res.status(500).json({ err }));
});

// get all building users
router.get('/:building_id/users', (req, res) => {
  const { building_id } = req.params;

  database('users')
    .where('building_id', building_id)
    .then((users) => {
      if (!users.length) {
        return res
          .status(404)
          .json({ error: `Could not find any users with building id: ${building_id}.` });
      }

      if (req.query.interest) {
        const interest_name = req.query.interest;
        return database('interests')
          .where('name', interest_name)
          .then((interest) => {
            if (!interest.length) {
              return res.status(404).json({ error: `Interest ${interest_name} is not valid.` });
            }

            const userIds = users.map(user => user.id);

            return database('user_interests')
              .where('interest_id', interest[0].id)
              .whereIn('user_id', userIds)
              .then((userInterests) => {
                const interestedUserIds = userInterests.map(userInterest => userInterest.user_id);
                const interestedUsers = users.filter(user => interestedUserIds.includes(user.id));
                res.status(200).json(interestedUsers);
              })
              .catch(err => res.status(500).json({ err }));
          })
          .catch(err => res.status(500).json({ err }));
      }

      return res.status(200).json(users);
    });
});

module.exports = router;
