const statsService = require('../services/statsService');

async function getStandingsByTournamentApi(req, res) {
  try {
    const params = req.query;
    const validation = statsService.validateTopStatParamApi(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    // Build query string for API call
    const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    // Fetch players from the API
    const apiResponse = await playerService.fetchData('apiOne', `v3/standings?${queryString}`);
    const standings = apiResponse.response;
    if (standings.length === 0) {
      return res.status(404).send('No standings found');
    }
    res.status(200).send(standings);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching players');
  }
}

async function getTopScorersByTournamentApi(req, res) {
  try {
    const params = req.query;
    const validation = statsService.validateTopStatParamApi(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    // Build query string for API call
    const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    // Fetch players from the API
    const apiResponse = await playerService.fetchData('apiOne', `v3/players/topscorers?${queryString}`);
    const players = apiResponse.response;
    if (players.length === 0) {
      return res.status(404).send('No players found');
    }
    res.status(200).send(players);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching players');
  }
}

async function getTopAssistsByTournamentApi(req, res) {
  try {
    const params = req.query;
    const validation = statsService.validateTopStatParamApi(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    // Build query string for API call
    const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    // Fetch players from the API
    const apiResponse = await playerService.fetchData('apiOne', `v3/players/topassist?${queryString}`);
    const players = apiResponse.response;
    if (players.length === 0) {
      return res.status(404).send('No players found');
    }
    res.status(200).send(players);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching players');
  }

}

async function getTopRedCardsByTournamentApi(req, res) {
  try {
    const params = req.query;
    const validation = statsService.validateTopStatParamApi(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    // Build query string for API call
    const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    // Fetch players from the API
    const apiResponse = await playerService.fetchData('apiOne', `v3/players/topredcards?${queryString}`);
    const players = apiResponse.response;
    if (players.length === 0) {
      return res.status(404).send('No players found');
    }
    res.status(200).send(players);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching players');
  }

}

async function getTopYellowCardsByTournamentApi(req, res) {
  try {
    const params = req.query;
    const validation = statsService.validateTopStatParamApi(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    // Build query string for API call
    const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    // Fetch players from the API
    const apiResponse = await playerService.fetchData('apiOne', `v3/players/topyellowcards?${queryString}`);
    const players = apiResponse.response;
    if (players.length === 0) {
      return res.status(404).send('No players found');
    }
    res.status(200).send(players);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching players');
  }
}

async function importTeamsStats(req, res) {
}

async function importPlayersStats(req, res) {
}

async function getPlayersStatsDb(req, res) {
  try {
    const filters = req.query;
    const validation = statsService.validatePlayersStatsParamsDb(filters);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    const playersStats = await statsService.getPlayersStatsFromDb(filters);
    if (playersStats.length === 0) {
      return res.status(404).send('No players stats found in the database');
    }
    res.status(200).send(playersStats);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching players stats from the database');
  }
}

async function deletePlayersStatsFromDb(req, res) {
  try {
    const filters = req.query;
    const validation = statsService.validatePlayersStatsParamsDb(filters);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    const result = await statsService.deletePlayersStatsFromDb(filters);
    if (result.affectedRows === 0) {
      return res.status(404).send('No players stats found to delete');
    }
    res.status(200).send('Players stats deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting players stats from the database');
  }
}

async function updatePlayersStatsInDb(req, res) {
  try {
    const params = req.query;
    const validation = statsService.validatePlayersStatsParamsDb(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    const { player_id, player_api_id, ...updateFields } = params;
    if (!player_id && !player_api_id) {
      return res.status(400).send('Missing player_id or player_api_id for WHERE clause');
    }
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).send('No fields provided for update');
    }
    const result = await statsService.updatePlayersStatsInDb(player_id, player_api_id, updateFields);
    if (result.affectedRows === 0) {
      return res.status(404).send('No players stats found to update');
    }
    res.status(200).send('Players stats updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating players stats in the database');
  }
}

async function getTeamsStatsDb(req, res) {
    try {
        const filters = req.query;
        const validation = statsService.validateTeamsStatsParamsDb(filters);
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
        const validation = statsService.validateTeamsStatsParamsDb(filters);
        if (!validation.valid) {
        return res.status(400).send(validation.message);
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
        const validation = statsService.validateTeamsStatsParamsDb(params);
        if (!validation.valid) {
        return res.status(400).send(validation.message);
        }
        const { team_id, team_api_id, ...updateFields } = params;
        if (!team_id && !team_api_id) {
        return res.status(400).send('Missing team_id or team_api_id for WHERE clause');
        }
        if (Object.keys(updateFields).length === 0) {
        return res.status(400).send('No fields provided for update');
        }
        const result = await statsService.updateTeamsStatsInDb(team_id, team_api_id, updateFields);
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
  getStandingsByTournamentApi,
  getTopScorersByTournamentApi,
  getTopAssistsByTournamentApi,
  getTopRedCardsByTournamentApi,
  getTopYellowCardsByTournamentApi,
  importTeamsStats,
  importPlayersStats,
  getPlayersStatsDb,
  deletePlayersStatsFromDb,
  updatePlayersStatsInDb,
  getTeamsStatsDb,
  deleteTeamsStatsFromDb,
  updateTeamsStatsInDb
};