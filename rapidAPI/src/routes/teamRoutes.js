const express = require('express');
const teamController = require('../controllers/teamController');
const { validateTeamParamsApi, validateTeamParamsDb } = require('../middlewares/teamValidator');
const router = express.Router();

router.post('/import', validateTeamParamsApi, teamController.importTeams);
router.get('/search', validateTeamParamsApi, teamController.searchTeams);
router.get('/get', validateTeamParamsDb, teamController.getTeamDb);
router.delete('/delete', validateTeamParamsDb, teamController.deleteTeamsDb);
router.put('/update', validateTeamParamsDb, teamController.updateTeamsDb);

module.exports = router;