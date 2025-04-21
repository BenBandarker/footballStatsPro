const express = require('express');
const playerController = require('../controllers/playerController');
const router = express.Router();

router.post('/import', playerController.importPlayers);
router.get('/search', playerController.searchPlayers);
router.get('/get', playerController.getPlayersFromDb);
router.delete('/delete', playerController.deletePlayersFromDb);
router.put('/update', playerController.updatePlayersInDb);

module.exports = router;