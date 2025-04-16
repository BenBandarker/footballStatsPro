const express = require('express');
const { importTeams, searchTeams, getTeamDb, deleteTeamsDb, updateTeamsDb } = require('../controllers/teamController');
const router = express.Router();

router.post('/import', importTeams);
router.get('/search', searchTeams);
router.get('/get', getTeamDb);
router.delete('/delete', deleteTeamsDb);
router.put('/update', updateTeamsDb);

module.exports = router;