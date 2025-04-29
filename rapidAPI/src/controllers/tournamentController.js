const tournamentService = require('../services/tournamentService');

// Handles the tournament import process: validates query parameters,
// fetches tournament data from an external API, and saves it to the database.
// Returns appropriate responses based on success, empty results, or errors.
async function importTournaments(req, res) {
  try {
    const params = req.query;
  const tournaments = await tournamentService.getTournamentsFromApi(params); // Fetch tournaments from the API
    if (tournaments.length === 0) {
      return res.status(404).send('No tournaments found');
    }

    // Save tournaments to the database
    for (const tournament of tournaments) {
      try {
        await tournamentService.saveTournamentToDatabase(tournament); // Attempt to save the team
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

// Searches for tournaments using API query parameters provided in the request.
// Accepts query parameters such as country and season through `req.query`.
// Returns a list of tournaments from the external API or an error message if none found.
async function searchTournaments(req, res) {
  try {
    const params = req.query;
    const tournaments = await tournamentService.getTournamentsFromApi(params); // Fetch tournaments from the API
    if (tournaments.length === 0) {
      return res.status(400).send('No tournaments found');
    }

    res.status(200).send(tournaments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error importing tournaments');
  }
}

// Retrieves tournaments from the database based on optional filtering criteria.
// Accepts query parameters such as location or year through `req.query`.
// Returns a filtered list of tournaments from the database or an error message.
async function getTournamentsDb(req, res) {
  try {
    const params = req.query; // Get dynamic parameters from req.query
    const tournaments = await tournamentService.getTournamentsFromDb(params);
    res.status(200).send(tournaments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting tournaments');
  }
}

// Deletes tournaments from the database based on specified filter criteria.
// Accepts query parameters such as location or year through `req.query`.
// Returns a success message if deletion is successful, or an error message otherwise.
async function deleteTournamentsDb(req, res) {
  try {
    const params = req.query;
    const result = await tournamentService.deleteTournamentsFromDb(params);
    if (result.affectedRows === 0) {
      return res.status(404).send('No players found to delete');
    }
    
    res.status(200).send('Tournament deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting tournament');
  }
}

// Updates tournament data in the database based on tournament_id or tournament_api_id.
// Accepts query parameters for identifying the tournament and the fields to update.
// Returns a success message if update is successful, or an error message otherwise.
async function updateTournamentsDb(req, res) {
  try {
    const params = req.query;

    const { tournament_id, tournament_api_id, ...updateFields } = params;

    if (!tournament_id && !tournament_api_id) {
      return res.status(400).send('Missing tournament_id or tournament_api_id for WHERE clause');
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).send('No fields provided for update');
    }

    await tournamentService.updateTournamentsInDb({ tournament_id, tournament_api_id }, updateFields);
    res.status(200).send('Tournament updated successfully');
  } catch (error) {
    console.error(error);
    res.status(400).send('Error updating tournament');
  }
}

module.exports = { importTournaments, searchTournaments, getTournamentsDb, deleteTournamentsDb, updateTournamentsDb };
