const express = require('express');
const statsController = require('../controllers/statsController');
const playerPerfController = require('../controllers/playerPerfController');
const teamStatsController = require('../controllers/teamStatsController');
const eventController = require('../controllers/eventController');
const validator = require('../middlewares/statsValidator');
const router = express.Router();

router.get('/standings', validator.validateTopStatsAPI, statsController.getStandingsByTournamentApi);
router.get('/topscorers', validator.validateTopStatsAPI, statsController.getTopScorersByTournamentApi);
router.get('/topassists', validator.validateTopStatsAPI, statsController.getTopAssistsByTournamentApi);
router.get('/topyellowcards', validator.validateTopStatsAPI, statsController.getTopYellowCardsByTournamentApi);
router.get('/topredcards', validator.validateTopStatsAPI, statsController.getTopRedCardsByTournamentApi);

router.post('/importPlayersPerf', validator.validatePlayerPerfAPI, playerPerfController.importPlayersPerfHandler);
router.get('/getPlayersPerf', validator.validatePlayerPerformanceDb, playerPerfController.getPlayersPerfDb);
router.delete('/deletePlayersPerf', validator.validatePlayerPerformanceDb, playerPerfController.deletePlayersPerfFromDb);
router.put('/updatePlayersPerf', validator.validatePlayerPerformanceDb, playerPerfController.updatePlayersPerfInDb);
router.get('/playerStatistics',validator.validatePlayerStatisticsParams,  playerPerfController.getPlayerPerformanceStatistics);

router.post('/importTeamsStats', validator.validateTeamStatsAPI, teamStatsController.importTeamsStatsHandler);
router.get('/getTeamsStats', validator.validateTeamMatchStatsDb, teamStatsController.getTeamsStatsDb);
router.delete('/deleteTeamsStats', validator.validateTeamMatchStatsDb, teamStatsController.deleteTeamsStatsFromDb);
router.put('/updateTeamsStats', validator.validateTeamMatchStatsDb, teamStatsController.updateTeamsStatsInDb);
router.get('/teamStatistics',validator.validateTeamMatchStatisticsParams,  teamStatsController.getTeamMatchStatsStatistics);

router.post('/importEvents', validator.validateEventAPI, eventController.importEventHandler);
router.get('/getEvents', validator.validateEventsDb, eventController.getEventDb);
router.delete('/deleteEvents', validator.validateEventsDb, eventController.deleteEventFromDb);
router.put('/updateEvents', validator.validateEventsDb, eventController.updateEventDb);
router.get('/eventStatistics', validator.validateEventStatisticsParams,  eventController.getTeamEventsStatistics);

module.exports = router;