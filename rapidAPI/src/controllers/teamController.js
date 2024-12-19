const { fetchData } = require('../services/apiService');

async function importTeamsbyCountry(req, res) {
  try {
    const { country } = req.params;
    const teams = await fetchData('apiOne',`teams?country=${country}`); 
    // Code to save teams to the database using SQL
    res.status(201).send('Teams imported successfully');
  } catch (error) {
    res.status(500).send('Error importing teams');
  }
}
async function importTeamsbyName(req, res) {
    try {
      const { name } = req.params;
      const teams = await fetchData('apiOne',`teams?name=${name}`);
      // Code to save teams to the database using SQL
      res.status(201).send('Teams imported successfully');
    } catch (error) {
      res.status(500).send('Error importing teams');
    }
}

async function importTeamsbyLeage(req, res) {
    try {
      const { leage_api_id, season } = req.query;
      const teams = await fetchData('apiOne',`v3/teams?league=${leage_api_id}&season=${season}`);
      // Code to save teams to the database using SQL
      res.status(201).send('Teams imported successfully');
    } catch (error) {
      res.status(500).send('Error importing teams');
    }
}
module.exports = { importTeamsbyCountry, importTeamsbyName, importTeamsbyLeage };