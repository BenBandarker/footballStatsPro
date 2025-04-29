const topService = require('../services/topStatsService');

async function getStandingsByTournamentApi(req, res) {
  try {
    const params = req.query;
    
    const standings = topService.getStandingsFromApi(params);
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
    
    const players = topService.getTopGoalsFromApi(params);
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
    
    const players = topService.getTopAssistsFromApi(params);
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
    
    const players = topService.getTopRedCardsFromApi(params);
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
    
    const players = topService.getTopYellowCardsFromApi(params);
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