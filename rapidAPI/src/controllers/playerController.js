const { fetchData } = require('../services/tournamentService');

async function importPlayersbyTeam(req, res) {
  try {
    const currentYear = new Date().getFullYear();
    const { season, team_api_id } = req.params;
    if (!season || typeof season !== 'number' || season < 2000 || season > currentYear) {
      return res.status(400).send('Invalid season parameter');
    }
    if (!team_api_id || typeof team_api_id !== 'number') {
      return res.status(400).send('Invalid team_api_id parameter');
    }
    const players = await fetchData('apiOne',`v3/players?team=${team_api_id}&season=${season}`); // Replace with the correct endpoint
    if(players.length === 0){
      res.status(404).send('No tournaments found');
    }
    else{
      // Code to save players to the database using SQL
      for(const player of players){
        const params = [player.id,
          player.player.name,
          player.player.birth.date,
          player.player.position,
          player.player.nationality,];
         
          const insertQuery = `INSERT INTO Players (player_api_id, player_name, date_of_birth, position, nationality) VALUES (?, ?, ?, ?, ?)`;
        
          await executeQuery(insertQuery, params);
        };
      
      res.status(201).send('Players imported successfully');
    }
  } catch (error) {
    res.status(500).send('Error importing players');
  }
}

async function importPlayersbyName(req, res) {
    try {
      const { name } = req.params;
      if (!name || typeof name !== 'string') {
        return res.status(400).send('Invalid name parameter');
      }
      const players = await fetchData('apiOne',`v3/players/profiles?search=${name}`);

      if(players.length === 0){
        res.status(404).send('No tournaments found');
      }
      else{
        // Code to save players to the database using SQL
        for(const player of players){
          const params = [player.id,
            player.name,
            player.birth.date,
            player.position,
            player.nationality,];
           
            const insertQuery = `INSERT INTO Players (player_api_id, player_name, date_of_birth, position, nationality) VALUES (?, ?, ?, ?, ?)`;
          
            await executeQuery(insertQuery, params);
          };
        
        res.status(201).send('Players imported successfully');
      }
    } catch (error) {
      res.status(500).send('Error importing players');
    }
  }

module.exports = { importPlayersbyTeam, importPlayersbyName };