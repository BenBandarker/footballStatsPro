const statsService = require('../services/teamStatsService');

async function importTeamsStats(req, res) {
  try {
    const params = req.query;
    const validation = statsService.validateTeamStatsParamsApi(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }

    const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    
    const apiResponse = await statsService.fetchData('apiOne', `v3/fixtures/statistics?${queryString}`);
    const teamsStats = apiResponse.response;
    if (teamsStats.length === 0) {
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
    res.status(201).send('Teams stats imported successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error importing teams stats');
  }
}

async function getTeamsStatsDb(req, res) {
  try {
    const filters = req.query;
    const validation = statsService.validateTeamMatchStatsParamsDb(filters);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    const teamsStats = await statsService.getTeamsStatsFromDb(filters);
    if (teamsStats.length === 0) {
      return res.status(404).send('No teams stats found in the database');
    }
    res.status(200).send(teamsStats);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching teams stats from the database');
  }
}

async function deleteTeamsStatsFromDb(req, res) {
  try {
    const filters = req.query;
    const validation = statsService.validateTeamMatchStatsParamsDb(filters);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    if( !filters.stat_id && (!filters.team_id || !filters.match_id)) {
      return res.status(400).send('Missing stat_id or team_id and match_id for WHERE clause');
    }
    const result = await statsService.deleteTeamsStatsFromDb(filters);
    if (result.affectedRows === 0) {
      return res.status(404).send('No teams stats found to delete');
    }
    res.status(200).send('Teams stats deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting teams stats from the database');
  }

}   

async function updateTeamsStatsInDb(req, res) {
  try {
    const params = req.query;
    const validation = statsService.validateTeamMatchStatsParamsDb(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
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

module.exports = {
  importTeamsStats,
  getTeamsStatsDb,
  deleteTeamsStatsFromDb,
  updateTeamsStatsInDb
};