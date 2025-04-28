const statsService = require('../services/playerPerfService');

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

module.exports = {
  getStandingsByTournamentApi,
  getTopScorersByTournamentApi,
  getTopAssistsByTournamentApi,
  getTopRedCardsByTournamentApi,
  getTopYellowCardsByTournamentApi
};