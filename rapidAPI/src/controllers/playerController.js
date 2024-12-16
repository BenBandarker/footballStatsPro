const { fetchData } = require('../services/apiService');

async function importPlayersbyTeam(req, res) {
  try {
    const { season, team_api_id } = req.params;
    const players = await fetchData('apiOne',`v3/players?team=${team_api_id}&season=${season}`); // Replace with the correct endpoint
    // Code to save players to the database using SQL
    res.status(201).send('Players imported successfully');
  } catch (error) {
    res.status(500).send('Error importing players');
  }
}

async function importPlayersbyName(req, res) {
    try {
      const { name } = req.params;
      const players = await fetchData('apiOne',`v3/players/profiles?search=${name}`); // Replace with the correct endpoint
      // Code to save players to the database using SQL
      res.status(201).send('Players imported successfully');
    } catch (error) {
      res.status(500).send('Error importing players');
    }
  }

module.exports = { importPlayersbyTeam, importPlayersbyName };