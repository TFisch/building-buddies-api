const express = require('express');

const router = express.Router();

// get all buildings
router.get('/', (req, res) => {
  res.send('get all buildings');
});

module.exports = router;
