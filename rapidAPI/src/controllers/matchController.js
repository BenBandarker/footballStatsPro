const { fetchData } = require('../services/apiService');

async function importMatches(req, res) {
  try {
    const matches = await fetchData('matches-endpoint'); // Replace with the correct endpoint
    // Code to save matches to the database using SQL
    res.status(201).send('Matches imported successfully');
  } catch (error) {
    res.status(500).send('Error importing matches');
  }
}

module.exports = { importMatches };
