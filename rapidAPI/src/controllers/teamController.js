const { fetchData } = require('../services/apiService');

async function importTeams(req, res) {
  try {
    const teams = await fetchData('teams-endpoint'); // Replace with the correct endpoint
    // Code to save teams to the database using SQL
    res.status(201).send('Teams imported successfully');
  } catch (error) {
    res.status(500).send('Error importing teams');
  }
}

module.exports = { importTeams };