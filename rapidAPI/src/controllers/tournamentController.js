const { fetchData } = require('../services/apiService');
const { executeQuery } = require('../services/databaseService');

async function importTournaments(req, res) {
  try {
    const { country, season } = req.body;
    if (!country || typeof country !== 'string') {
      return res.status(400).send('Invalid country parameter');
    }
    if (!season || typeof season !== 'number' || season < 2010) {
      return res.status(400).send('Invalid season parameter, Make sure the season is between 2010 and current year.');
    }
    const apiResponse = await fetchData('apiOne',`v3/leagues?country=${country}&season=${season}`);
    const tournaments = apiResponse.response;
    // Code to save tournaments to the database using SQL - DONE
    if(tournaments.length === 0){
      res.status(404).send('No tournaments found');
    }
    else{
      for(const tournament of tournaments){
        // Save tournament to the database
        const params = [tournament.league.id,
          tournament.league.name,
          tournament.seasons[tournament.seasons.length-1].start,
          tournament.seasons[tournament.seasons.length-1].end,
          tournament.country.name,
        ];
        const insertQuery = `INSERT INTO Tournaments (tournament_api_id, tournament_name, start_date, end_date, location) VALUES (?, ?, ?, ?, ?)`;

        await executeQuery(insertQuery, params);
      }
      res.status(201).send('Tournaments imported successfully');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error importing tournaments');
  }
}

module.exports = { importTournaments };
