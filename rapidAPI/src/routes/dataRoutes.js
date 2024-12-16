const express = require('express');
const {
  importTeamsFromApiOne,
  importTeamsFromApiTwo,
} = require('../controllers/teamsController');
const router = express.Router();

router.post('/import/api-one', importTeamsFromApiOne);
router.post('/import/api-two', importTeamsFromApiTwo);

module.exports = router;
