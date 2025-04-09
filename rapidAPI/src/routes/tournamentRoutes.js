const express = require('express');
const { importTournaments, searchTournaments, getTournamentsDb, deleteTournamentsDb, updateTournamentsDb } = require('../controllers/tournamentController');
const router = express.Router();

router.post('/import', importTournaments);
router.get('/search', searchTournaments);
router.get('/get', getTournamentsDb);
router.delete('/delete', deleteTournamentsDb);
router.put('/update', updateTournamentsDb);


module.exports = router;
