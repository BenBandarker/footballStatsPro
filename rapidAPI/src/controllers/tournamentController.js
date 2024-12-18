const { fetchData } = require('../services/apiService');

async function importTournaments(req, res) {
  try {
    const { country } = req.params;
    const tournaments = await fetchData('apiOne',`v3/leagues?country=${country}`);
    // Code to save tournaments to the database using SQL - DONE
    for(const tournament of tournaments){
      // Save tournament to the database
      const params = [tournament.league.id,
        tournament.league.name,
        tournament.seasons[seasons.length-1].start,
        tournament.seasons[seasons.length-1].end,
        tournament.seasons[seasons.length-1].year,
        tournament.country.name,
      ];
      const insertQuery = `INSERT INTO Tournaments (tournament_api_id, tournament_name, start_date, end_date, year, location) VALUES (?, ?, ?, ?, ?, ?)`;

      await executeQuery(insertQuery, params);
    }
    res.status(201).send('Tournaments imported successfully');
  } catch (error) {
    res.status(500).send('Error importing tournaments');
  }
}

module.exports = { importTournaments };
