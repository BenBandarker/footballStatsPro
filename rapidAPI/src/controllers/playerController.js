const playerService = require('../services/playerService');


async function importPlayers(req, res) {
  try {
    const params = req.query;
    // Validate parameters
    const validation = playerService.validatePlayersParamsApi(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    // Build query string for API call
    const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    // Fetch players from the API
    const apiResponse = await playerService.fetchData('apiOne', `v3/players?${queryString}`);
    const players = apiResponse.response;
    if (players.length === 0) {
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
    res.status(201).send('Players imported successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error importing players');
  }
}

async function searchPlayers(req, res) {
  try {
    const params = req.query;
    // Validate parameters
    const validation = playerService.validatePlayersParamsApi(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    // Build query string for API call
    const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    // Fetch players from the API
    const apiResponse = await playerService.fetchData('apiOne', `v3/players?${queryString}`);
    const players = apiResponse.response;
    if (players.length === 0) {
      return res.status(404).send('No players found');
    }
    res.status(200).send(players);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching players');
  }
}

async function getPlayersFromDb(req, res) {
  try {
    const filters = req.query;
    const validation = playerService.validatePlayersParamsDb(filters);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
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

async function deletePlayersFromDb(req, res) {
  try {
    const filters = req.query;
    const validation = playerService.validatePlayersParamsDb(filters);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
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

async function updatePlayersInDb(req, res) {
  try {
    const params = req.query;

    const validation = playerService.validatePlayersParamsDb(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }

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

// async function importPlayersbyTeam(req, res) {
//   try {
//     const currentYear = new Date().getFullYear();
//     const { season, team_api_id } = req.params;
//     if (!season || typeof season !== 'number' || season < 2000 || season > currentYear) {
//       return res.status(400).send('Invalid season parameter');
//     }
//     if (!team_api_id || typeof team_api_id !== 'number') {
//       return res.status(400).send('Invalid team_api_id parameter');
//     }
//     const players = await fetchData('apiOne',`v3/players?team=${team_api_id}&season=${season}`); // Replace with the correct endpoint
//     if(players.length === 0){
//       res.status(404).send('No tournaments found');
//     }
//     else{
//       // Code to save players to the database using SQL
//       for(const player of players){
//         const params = [player.id,
//           player.player.name,
//           player.player.birth.date,
//           player.player.position,
//           player.player.nationality,];
         
//           const insertQuery = `INSERT INTO Players (player_api_id, player_name, date_of_birth, position, nationality) VALUES (?, ?, ?, ?, ?)`;
        
//           await executeQuery(insertQuery, params);
//         };
      
//       res.status(201).send('Players imported successfully');
//     }
//   } catch (error) {
//     res.status(500).send('Error importing players');
//   }
// }

// async function importPlayersbyName(req, res) {
//     try {
//       const { name } = req.params;
//       if (!name || typeof name !== 'string') {
//         return res.status(400).send('Invalid name parameter');
//       }
//       const players = await fetchData('apiOne',`v3/players/profiles?search=${name}`);

//       if(players.length === 0){
//         res.status(404).send('No tournaments found');
//       }
//       else{
//         // Code to save players to the database using SQL
//         for(const player of players){
//           const params = [player.id,
//             player.name,
//             player.birth.date,
//             player.position,
//             player.nationality,];
           
//             const insertQuery = `INSERT INTO Players (player_api_id, player_name, date_of_birth, position, nationality) VALUES (?, ?, ?, ?, ?)`;
          
//             await executeQuery(insertQuery, params);
//           };
        
//         res.status(201).send('Players imported successfully');
//       }
//     } catch (error) {
//       res.status(500).send('Error importing players');
//     }
//   }

module.exports = { 
  importPlayers,
  searchPlayers,
  getPlayersFromDb,
  deletePlayersFromDb,
  updatePlayersInDb
  // importPlayersbyTeam,
  // importPlayersbyName
};