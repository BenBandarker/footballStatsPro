const express = require('express');
const tournamentController = require('../controllers/tournamentController');
const { validateTournamentParamsApi, validateTournamentParamsDb } = require('../middlewares/tournamentValidator');
const router = express.Router();

router.post('/import', validateTournamentParamsApi, tournamentController.importTournaments);
router.get('/search', validateTournamentParamsApi, tournamentController.searchTournaments);
router.get('/get', validateTournamentParamsDb, tournamentController.getTournamentsDb);
router.delete('/delete', validateTournamentParamsDb, tournamentController.deleteTournamentsDb);
router.put('/update', validateTournamentParamsDb, tournamentController.updateTournamentsDb);

module.exports = router;
