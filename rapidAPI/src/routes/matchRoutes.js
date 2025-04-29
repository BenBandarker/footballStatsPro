const express = require('express');
const matchController = require('../controllers/matchController');
const { validateMatchParamsApi, validateMatchParamsDb } = require('../middlewares/matchValidator');
const router = express.Router();


router.post('/import', validateMatchParamsApi, matchController.importMatches);
router.get('/search', validateMatchParamsApi, matchController.searchMatches);
router.get('/get', validateMatchParamsDb, matchController.getMatchesFromDb);
router.delete('/delete', validateMatchParamsDb, matchController.deleteMatchesFromDb);
router.put('/update', validateMatchParamsDb, matchController.updateMatchesInDb);

module.exports = router;