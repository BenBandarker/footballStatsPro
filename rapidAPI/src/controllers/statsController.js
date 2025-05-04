const topService = require('../services/topStatsService');

// Search data in the external API.
// Accepts request and response objects (req, res).
// Returns appropriate HTTP response.
async function getStandingsByTournamentApi(req, res) {
  try {
    const params = req.query;
    
    const standings = await topService.getStandingsFromApi(params);
    if (standings.length === 0) {
      return res.status(404).send('No standings found');
    }
    res.status(200).send(standings);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching players');
  }
}

// Search data in the external API.
// Accepts request and response objects (req, res).
// Returns appropriate HTTP response.
async function getTopScorersByTournamentApi(req, res) {
  try {
    const params = req.query;
    
    const players = await topService.getTopGoalsFromApi(params);
    if (players.length === 0) {
      return res.status(404).send('No players found');
    }
    res.status(200).send(players);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching players');
  }
}

// Search data in the external API.
// Accepts request and response objects (req, res).
// Returns appropriate HTTP response.
async function getTopAssistsByTournamentApi(req, res) {
  try {
    const params = req.query;
    
    const players = await topService.getTopAssistsFromApi(params);
    if (players.length === 0) {
      return res.status(404).send('No players found');
    }
    res.status(200).send(players);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching players');
  }

}

// Search data in the external API.
// Accepts request and response objects (req, res).
// Returns appropriate HTTP response.
async function getTopRedCardsByTournamentApi(req, res) {
  try {
    const params = req.query;
    
    const players = await topService.getTopRedCardsFromApi(params);
    if (players.length === 0) {
      return res.status(404).send('No players found');
    }
    res.status(200).send(players);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching players');
  }

}

// Search data in the external API.
// Accepts request and response objects (req, res).
// Returns appropriate HTTP response.
async function getTopYellowCardsByTournamentApi(req, res) {
  try {
    const params = req.query;
    
    const players = await topService.getTopYellowCardsFromApi(params);
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