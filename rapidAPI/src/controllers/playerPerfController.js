const statsService = require('../services/playerPerfService');

async function importPlayersPerf(req, res) {
  try {
    const params = req.query;
    // Validate parameters
    const validation = statsService.validatePlayerPerfParamApi(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    // Build query string for API call
    const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    // Fetch players stats from the API
    const apiResponse = await statsService.fetchData('apiOne', `v3/fixtures/players?${queryString}`);
    const playersStats = apiResponse.response;
    if (playersStats.length === 0) {
      return res.status(404).send('No players stats found');
    }
    // Save players stats to the database
    for (const team of playersStats) {
      for (const playerStat of team.players) {
        try {
          await statsService.savePlayerPerformanceToDatabase(playerStat.player.id, params.fixture, playerStat.statistics[0]);
        } catch (error) {
          // Handle duplicate entry error and log the skipped player
          if (error.code === 'ER_DUP_ENTRY') {
            console.log(`Duplicate entry for (player_id, match_id) ${playerStat.player.id} & ${params.fixture}, skipping...`);
          } else {
            console.error(`Error saving player API-ID ${playerStat.player.id}: ${error.message}`);
            throw error; 
          }
        }
      }
    }

    res.status(201).send('Players stats imported successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error importing players stats');
  }
}

async function getPlayersPerfDb(req, res) {
  try {
    const filters = req.query;
    const validation = statsService.validatePlayerPerformanceParamsDb(filters);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    const playersStats = await statsService.getPlayerPerformanceFromDb(filters);
    if (playersStats.length === 0) {
      return res.status(404).send('No players stats found in the database');
    }
    res.status(200).send(playersStats);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching players stats from the database');
  }
}

async function deletePlayersPerfFromDb(req, res) {
  try {
    const filters = req.query;
    const validation = statsService.validatePlayerPerformanceParamsDb(filters);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    const result = await statsService.deletePlayerPerformance(filters);
    if (result.affectedRows === 0) {
      return res.status(404).send('No players stats found to delete');
    }
    res.status(200).send('Players stats deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting players stats from the database');
  }
}

async function updatePlayersPerfInDb(req, res) {
  try {
    const params = req.query;
    const validation = statsService.validatePlayerPerformanceParamsDb(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    const { performance_id, player_id, match_id, ...updateFields } = params;
    if ( !performance_id && (!player_id || !match_id_id)) {
      return res.status(400).send('Missing performance_id or player_id and match_id for WHERE clause');
    }
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).send('No fields provided for update');
    }
    const result = await statsService.updatePlayersStatsInDb({ performance_id, player_id, match_id} , updateFields);
    if (result.affectedRows === 0) {
      return res.status(404).send('No players stats found to update');
    }
    res.status(200).send('Players stats updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating players stats in the database');
  }
}

module.exports = {
  importPlayersPerf,
  getPlayersPerfDb,
  deletePlayersPerfFromDb,
  updatePlayersPerfInDb
};