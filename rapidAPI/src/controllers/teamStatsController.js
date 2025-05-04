const statsService = require('../services/teamStatsService');

// Import data from API and insert into the database.
// Accepts request and response objects (req, res).
// Returns appropriate HTTP response.
async function importTeamsStats(req, res, internalCall = false) {
  try {
    const params = req.query;

    const teamsStats = await statsService.fetchTeamStatsFromApi(params);
    if (teamsStats.length === 0) {
      if( internalCall ) 
        return [];
      return res.status(404).send('No teams stats found');
    }
    
    for (const teamStat of teamsStats) {
      try {
        await statsService.saveTeamStatsToDatabase(params.fixture, teamStat);
      } catch (error) {
        // Handle duplicate entry error and log the skipped team
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`Duplicate entry for fixture ID & team ID ${params.fixture} & ${params.team}, skipping...`);
        } else {
          console.error(`Error saving fixture ID & team ID ${params.fixture} & ${params.team}: ${error.message}`);
          throw error; 
        }
      }
    }

    if(internalCall) 
      return teamsStats; // Return teamsStats if called internally
    res.status(201).send('Teams stats imported successfully');
  } catch (error) {
    console.error(error);
    if(internalCall) 
      throw error;
    res.status(500).send('Error importing teams stats');
  }
}

// Retrieve data from the database.
// Accepts request and response objects (req, res).
// Returns appropriate HTTP response.
async function getTeamsStatsDb(req, res) {
  try {
    const filters = req.query;

    const teamsStats = await statsService.getTeamStatsFromDb(filters);
    if (teamsStats.length === 0) {
      return res.status(404).send('No teams stats found in the database');
    }
    res.status(200).send(teamsStats);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching teams stats from the database');
  }
}

// Delete specific records from the database.
// Accepts request and response objects (req, res).
// Returns appropriate HTTP response.
async function deleteTeamsStatsFromDb(req, res) {
  try {
    const filters = req.query;

    if( !filters.stat_id && (!filters.team_id || !filters.match_id)) {
      return res.status(400).send('Missing stat_id or team_id and match_id for WHERE clause');
    }
    const result = await statsService.deleteTeamStatsFromDb(filters);
    if (result.affectedRows === 0) {
      return res.status(404).send('No teams stats found to delete');
    }
    res.status(200).send('Teams stats deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting teams stats from the database');
  }

}   

// Update existing records in the database.
// Accepts request and response objects (req, res).
// Returns appropriate HTTP response.
async function updateTeamsStatsInDb(req, res) {
  try {
    const params = req.query;

    const { stat_id, match_id, team_id,...updateFields } = params;
    if(!stat_id && (!team_id || !match_id)) {
      return res.status(400).send('Missing stat_id or team_id and match_id for WHERE clause');
    }
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).send('No fields provided for update');
    }
    const result = await statsService.updateTeamStatsInDb({ stat_id, match_id, team_id }, updateFields);
    if (result.affectedRows === 0) {
      return res.status(404).send('No teams stats found to update');
    }
    res.status(200).send('Teams stats updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating teams stats in the database');
  }
}


/**
 * Retrieve data from the database.
 * Accepts request and response objects (req, res).
 * Example: req.query = {
 *   groupBy: 'team_id',
 *   aggregates: JSON.stringify([
 *     { field: 'shots_on_goal', operation: 'SUM' },
 *     { field: 'shots_outsidebox', operation: 'AVG' }
 *   ]),
 *   filters: JSON.stringify({ match_id: 101, team_id: 22 })
 * }
 * Returns appropriate HTTP response.
 */
async function getTeamMatchStatsStatistics(req, res) {
  try {
    const { groupBy, aggregates } = req.query;

    if (!groupBy || !aggregates) {
      return res.status(400).send('Missing groupBy or aggregates parameters');
    }

    const aggregatesArray = aggregates.split(',');

    const results = await statsService.getTeamMatchStatsStatistics({ groupBy, aggregates: aggregatesArray });

    if (results.length === 0) {
      return res.status(404).send('No statistics found');
    }

    res.status(200).send(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching team match stats statistics');
  }
}

module.exports = {
  importTeamsStats,
  getTeamsStatsDb,
  deleteTeamsStatsFromDb,
  updateTeamsStatsInDb,
  getTeamMatchStatsStatistics
};