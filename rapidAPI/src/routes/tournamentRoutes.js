const express = require('express');
const tournamentController = require('../controllers/tournamentController');
const router = express.Router();

router.post('/import', tournamentController.importTournaments);
router.get('/search', tournamentController.searchTournaments);
router.get('/get', tournamentController.getTournamentsDb);
router.delete('/delete', tournamentController.deleteTournamentsDb);
router.put('/update', tournamentController.updateTournamentsDb);


module.exports = router;
