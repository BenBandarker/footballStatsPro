const express = require('express');
const matchController = require('../controllers/matchController');
const router = express.Router();


router.post('/import', matchController.importMatches);
router.get('/search', matchController.searchMatches);
router.get('/get', matchController.getMatchesFromDb);
router.delete('/delete', matchController.deleteMatchesFromDb);
router.put('/update', matchController.updateMatchesInDb);

module.exports = router;