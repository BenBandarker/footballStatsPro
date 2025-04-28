const express = require('express');
const statsController = require('../controllers/statsController');
const playerPerfController = require('../controllers/playerPerfController');
const teamStatsController = require('../controllers/teamStatsController');
const router = express.Router();

router.get('/standings', statsController.getStandingsByTournamentApi);
router.get('/topscorers', statsController.getTopScorersByTournamentApi);
router.get('/topassists', statsController.getTopAssistsByTournamentApi);
router.get('/topyellowcards', statsController.getTopYellowCardsByTournamentApi);
router.get('/topredcards', statsController.getTopRedCardsByTournamentApi);

router.post('/importPlayersPerf', playerPerfController.importPlayersPerf);
router.get('/getPlayersPerf', playerPerfController.getPlayersPerfDb);
router.delete('/deletePlayersPerf', playerPerfController.deletePlayersPerfFromDb);
router.put('/updatePlayersPerf', playerPerfController.updatePlayersPerfInDb);

router.get('/importTeamsStats', teamStatsController.importTeamsStats);
router.get('/getTeamsStats', teamStatsController.getTeamsStatsFromDb);
router.delete('/deleteTeamsStats', teamStatsController.deleteTeamsStatsFromDb);
router.put('/updateTeamsStats', teamStatsController.updateTeamsStatsInDb);

module.exports = router;