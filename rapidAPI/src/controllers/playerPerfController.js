const statsService = require('../services/playerPerfService');

// Import data from API and insert into the database.
// Accepts request and response objects (req, res).
// Returns appropriate HTTP response.
async function importPlayersPerf(req, res, internalCall = false) {
  try {
    const params = req.query;

    const playersStats = await statsService.fetchPlayerPerformanceFromApi(params);
    if (playersStats.length === 0) {
      if (internalCall) {
        return []; // Return an empty array for internal calls
      }
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
    if ( internalCall ) 
      return playersStats; // Return the players stats for internal calls
    res.status(201).send('Players stats imported successfully');
  } catch (error) {
    console.error(error);
    if (internalCall) 
      throw error; // Rethrow the error for internal calls
    res.status(500).send('Error importing players stats');
  }
}

async function importPlayersPerfHandler(req, res) {
  return await importPlayersPerf(req, res, false);
}

// Retrieve data from the database.
// Accepts request and response objects (req, res).
// Returns appropriate HTTP response.
async function getPlayersPerfDb(req, res) {
  try {
    const filters = req.query;

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

// Delete specific records from the database.
// Accepts request and response objects (req, res).
// Returns appropriate HTTP response.
async function deletePlayersPerfFromDb(req, res) {
  try {
    const filters = req.query;

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

// Update existing records in the database.
// Accepts request and response objects (req, res).
// Returns appropriate HTTP response.
async function updatePlayersPerfInDb(req, res) {
  try {
    const params = req.query;

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

/**
 * Retrieve data from the database.
 * Accepts request and response objects (req, res).
 * Example: req.query = {
 *   groupBy: 'player_id',
 *   aggregates: JSON.stringify([
 *     { field: 'goals', operation: 'SUM' },
 *     { field: 'minutes_played', operation: 'AVG' }
 *   ]),
 *   filters: JSON.stringify({ match_id: 101, team_id: 22 })
 * }
 * Returns appropriate HTTP response.
 */
async function getPlayerPerformanceStatistics(req, res) {
  try {
    const { groupBy, aggregates } = req.query;

    if (!groupBy || !aggregates) {
      return res.status(400).send('Missing groupBy or aggregates parameters');
    }

    const aggregatesArray = aggregates.split(',');

    const results = await statsService.getPlayerPerformanceStatistics({ groupBy, aggregates: aggregatesArray });

    if (results.length === 0) {
      return res.status(404).send('No statistics found');
    }

    res.status(200).send(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching player performance statistics');
  }
}

module.exports = {
  importPlayersPerf,
  importPlayersPerfHandler,
  getPlayersPerfDb,
  deletePlayersPerfFromDb,
  updatePlayersPerfInDb,
  getPlayerPerformanceStatistics
};