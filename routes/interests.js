const express = require('express');

const router = express.Router();

// get all interests
router.get('/', (req, res) => {
  res.send('get all interests');
});

module.exports = router;
