const express = require('express');
const playerController = require('../controllers/playerController');
const { validatePlayerParamsApi, validatePlayerParamsDb } = require('../middlewares/playerValidator');
const router = express.Router();

router.post('/import', validatePlayerParamsApi, playerController.importPlayers);
router.get('/search', validatePlayerParamsApi, playerController.searchPlayers);
router.get('/get', validatePlayerParamsDb, playerController.getPlayersFromDb);
router.delete('/delete', validatePlayerParamsDb, playerController.deletePlayersFromDb);
router.put('/update', validatePlayerParamsDb, playerController.updatePlayersInDb);

module.exports = router;