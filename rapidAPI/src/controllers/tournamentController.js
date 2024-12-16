const { fetchData } = require('../services/apiService');

async function importTournaments(req, res) {
  try {
    const { country } = req.params;
    const tournaments = await fetchData('apiOne',`v3/leagues?country=${country}`);
    // Code to save tournaments to the database using SQL
    res.status(201).send('Tournaments imported successfully');
  } catch (error) {
    res.status(500).send('Error importing tournaments');
  }
}

module.exports = { importTournaments };
