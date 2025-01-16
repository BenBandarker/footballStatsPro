const { fetchData } = require('../services/apiService');
const { executeQuery } = require('../services/databaseService');

// Function to validate request parameters
function validateParams(params) {
  const currentYear = new Date().getFullYear();

  for (const [key, value] of Object.entries(params)) {
    switch (key) {
      case 'country':
        if (!value || typeof value !== 'string') {
          return { valid: false, message: 'Invalid country parameter' };
        }
        break;

      case 'season':
        if (!value || typeof value !== 'number' || value < 2010 || value > currentYear) {
          return { valid: false, message: 'Invalid season parameter. Make sure the season is between 2010 and the current year.' };
        }
        break;

      default:
        return { valid: false, message: `Unknown or invalid parameter: ${key}` };
    }
  }

  return { valid: true };
}

// Function to save a single tournament to the database
async function saveTournamentToDatabase(tournament) {
  const params = [
    tournament.league.id,
    tournament.league.name,
    tournament.seasons[tournament.seasons.length - 1].start,
    tournament.seasons[tournament.seasons.length - 1].end,
    tournament.country.name,
  ];

  const insertQuery = `INSERT INTO Tournaments (tournament_api_id, tournament_name, start_date, end_date, location) VALUES (?, ?, ?, ?, ?)`;

  await executeQuery(insertQuery, params);
}

// Main function to import tournaments
async function importTournaments(req, res) {
  try {
    const { country, season } = req.body;

    // Validate parameters
    const validation = validateParams({ country, season });
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }

    // Fetch tournaments from the API
    const apiResponse = await fetchData('apiOne', `v3/leagues?country=${country}&season=${season}`);
    const tournaments = apiResponse.response;

    if (tournaments.length === 0) {
      return res.status(404).send('No tournaments found');
    }

    // Save tournaments to the database
    for (const tournament of tournaments) {
      await saveTournamentToDatabase(tournament);
    }

    res.status(201).send('Tournaments imported successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error importing tournaments');
  }
}

module.exports = { importTournaments };
