const { fetchData, validateTournamentParamsApi } = require('../services/apiService');
const { executeQuery, validateTournamentParamsDb } = require('../services/databaseService');

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

// Function to import tournaments
async function importTournaments(req, res) {
  try {
    const params = req.query;

    // Validate parameters
    const validation = validateTournamentParamsApi(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
  // Build query string for API call
  const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');

  // Fetch tournaments from the API
  const apiResponse = await fetchData('apiOne', `v3/leagues?${queryString}`);
  const tournaments = apiResponse.response;
    if (tournaments.length === 0) {
      return res.status(404).send('No tournaments found');
    }

    // Save tournaments to the database
    for (const tournament of tournaments) {
      try {
        await saveTournamentToDatabase(tournament); // Attempt to save the team
      } catch (error) {
        // Handle duplicate entry error and log the skipped team
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`Duplicate entry for tournament API-ID ${tournament.league.id}, skipping...`);
        } else {
          console.error(`Error saving tournament API_ID ${tournament.league.id}: ${error.message}`);
          throw error; 
        }
      }
    }

    res.status(201).send('Tournaments imported successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error importing tournaments');
  }
}

// Function to search for tournaments at the api service and return the result
async function searchTournaments(req, res) {
  try {
    const params = req.query;

    // Validate parameters
    const validation = validateTournamentParams(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
  // Build query string for API call
  const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');

  // Fetch tournaments from the API
  const apiResponse = await fetchData('apiOne', `v3/leagues?${queryString}`);
  const tournaments = apiResponse.response;
    if (tournaments.length === 0) {
      return res.status(404).send('No tournaments found');
    }

    res.status(200).send(tournaments);

    res.status(201).send('Tournaments imported successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error importing tournaments');
  }
}

// Function to get tournaments
async function getTournamentsDb(req, res) {
  try {
    const params = req.query; // Get dynamic parameters from req.query
    const validation = validateTournamentParamsDb(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }

    const queryBase = 'SELECT * FROM Tournaments';
    const queryConditions = [];
    const queryParams = [];

    // Build the WHERE clause dynamically
    for (const [key, value] of Object.entries(params)) {
      queryConditions.push(`${key} = ?`);                          
      queryParams.push(value);
    }

    // Combine the base query with conditions if any
    const query = queryConditions.length > 0 ? `${queryBase} WHERE ${queryConditions.join(' AND ')}` : queryBase;

    const tournaments = await executeQuery(query, queryParams);

    res.status(200).send(tournaments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting tournaments');
  }
}

// Function to delete tournaments from the database
async function deleteTournamentsDb(req, res) {
  try {
    const params = req.query;
    const validation = validateTournamentParamsDb(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    const queryConditions = [];
    const queryParams = [];

    // Build the WHERE clause dynamically
    for (const [key, value] of Object.entries(params)) {
      queryConditions.push(`${key} = ?`);                          
      queryParams.push(value);
    }

    if(queryConditions.length === 0) {
      return res.status(400).send('No parameters provided for deletion');
    }

    const deleteQuery = `DELETE FROM Tournaments WHERE ${queryConditions.join(' AND ')}`;
    await executeQuery(deleteQuery, queryParams);

    res.status(200).send('Tournament deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting tournament');
  }
}

module.exports = { importTournaments, searchTournaments, getTournamentsDb, deleteTournamentsDb };
