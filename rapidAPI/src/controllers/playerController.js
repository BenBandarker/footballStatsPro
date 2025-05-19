const playerService = require('../services/playerService');

// Import data from API and insert into the database.
// Accepts request parameters (req.query) and a boolean flag internalCall.
// Returns an HTTP response or an array of players if internalCall is true.
async function importPlayers(req, res, internalCall = false) {
  try {
    const params = req.query;

    const players = await playerService.getPlayersFromApi(params); // Fetch players from the API
    if (players.length === 0) {
      if (internalCall) 
        return []; // Return empty array if called internally
      return res.status(404).send('No players found');
    }
    // Save players to the database
    for (const player of players) {
      try {
        await playerService.savePlayerToDatabase(player); // Attempt to save the player
      } catch (error) {
        // Handle duplicate entry error and log the skipped player
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`Duplicate entry for player API-ID ${player.player.id}, skipping...`);
        } else {
          console.error(`Error saving player API-ID ${player.player.id}: ${error.message}`);
          throw error; 
        }
      }
    }
    if (internalCall) return players;
    res.status(201).send('Players imported successfully');
  } catch (error) {
    console.error(error);
    if (internalCall) throw error;
    res.status(500).send('Error importing players');
  }
}

async function importPlayersHandler(req, res) {
  return await importPlayers(req, res, false);
}


// Search data in the external API.
// Accepts request parameters (req.query).
// Returns an HTTP response with players or 404 if none found.
async function searchPlayers(req, res) {
  try {
    const params = req.query;

    const players = await playerService.getPlayersFromApi(params); // Fetch players from the API
    if (players.length === 0) {
      return res.status(404).send('No players found');
    }
    res.status(200).send(players);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching players');
  }
}


// Retrieve data from the database.
// Accepts request and response objects (req, res).
// Returns appropriate HTTP response or data object.
async function getPlayersFromDb(req, res) {
  try {
    const filters = req.query;

    const players = await playerService.getPlayersFromDb(filters);
    if (players.length === 0) {
      return res.status(404).send('No players found in the database');
    }
    res.status(200).send(players);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching players from the database');
  }
}


// Delete specific records from the database.
// Accepts request and response objects (req, res).
// Returns appropriate HTTP response or data object.
async function deletePlayersFromDb(req, res) {
  try {
    const filters = req.query;

    const result = await playerService.deletePlayersFromDb(filters);
    if (result.affectedRows === 0) {
      return res.status(404).send('No players found to delete');
    }
    res.status(200).send('Players deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting players from the database');
  }
}

// Update existing records in the database.
// Accepts request and response objects (req, res).
// Returns appropriate HTTP response or data object.
async function updatePlayersInDb(req, res) {
  try {
    const params = req.query;

    const { player_id, player_api_id, ...updateFields } = params;

    if (!player_id && !player_api_id) {
      return res.status(400).send('Missing player_id or player_api_id for WHERE clause');
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).send('No fields provided for update');
    }

    await playerService.updatePlayersInDb({ player_id, player_api_id }, updateFields);
    res.status(200).send('Player updated successfully');
  } catch (error) {
    console.error(error);
    res.status(400).send('Error updating tournament');
  }
}

module.exports = { 
  importPlayers,
  importPlayersHandler,
  searchPlayers,
  getPlayersFromDb,
  deletePlayersFromDb,
  updatePlayersInDb
};