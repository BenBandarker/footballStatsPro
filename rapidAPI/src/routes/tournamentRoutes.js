const express = require('express');
const { importTournaments } = require('../controllers/tournamentController');
const router = express.Router();

router.post('/import', importTournaments);

// router.get('/', getTournaments);

module.exports = router;
