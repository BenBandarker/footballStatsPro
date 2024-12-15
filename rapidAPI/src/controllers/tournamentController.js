const { fetchData } = require('../services/apiService');

async function importTournaments(req, res) {
  try {
    const tournaments = await fetchData('tournaments-endpoint'); // Replace with the correct endpoint
    // Code to save tournaments to the database using SQL
    res.status(201).send('Tournaments imported successfully');
  } catch (error) {
    res.status(500).send('Error importing tournaments');
  }
}

module.exports = { importTournaments };
