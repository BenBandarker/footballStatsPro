const { fetchData } = require('../services/apiService');

async function importTeamsbyCountry(req, res) {
  try {
    const { country } = req.params;
    if (!country || typeof country !== 'string') {
      return res.status(400).send('Invalid country parameter');
    }
    const teams = await fetchData('apiOne',`teams?country=${country}`); 
    
    if(teams.length === 0){
      res.status(404).send('No tournaments found');
    }
    else{
      for(const team of teams){
        // Save tournament to the database
        const params = [team.team.id,
          team.team.name,
          team.team.country,
          team.team.founded,
          team.venue.name,
        ];
        const insertQuery = `INSERT INTO Teams (team_api_id, team_name,country, founded_year, stadium_name) VALUES (?, ?, ?, ?, ?)`;

        await executeQuery(insertQuery, params);
      }
      res.status(201).send('Tournaments imported successfully');
    }
  } catch (error) {
    res.status(500).send('Error importing teams');
  }
}
async function importTeamsbyName(req, res) {
    try {
      const { name } = req.params;
      if (!name || typeof name !== 'string') {
        return res.status(400).send('Invalid name parameter');
      }

      const teams = await fetchData('apiOne',`teams?name=${name}`);
      if(teams.length === 0){
        res.status(404).send('No tournaments found');
      }
      else{
        for(const team of teams){
          // Save tournament to the database
          const params = [team.team.id,
            team.team.name,
            team.team.country,
            team.team.founded,
            team.venue.name,
          ];
          const insertQuery = `INSERT INTO Teams (team_api_id, team_name,country, founded_year, stadium_name) VALUES (?, ?, ?, ?, ?)`;
  
          await executeQuery(insertQuery, params);
        }
        res.status(201).send('Tournaments imported successfully');
      }
    } catch (error) {
      res.status(500).send('Error importing teams');
    }
}

async function importTeamsbyLeage(req, res) {
    try {
      const { leage_api_id, season } = req.query;
      if (!leage_api_id || typeof leage_api_id !== 'number') {
        return res.status(400).send('Invalid leage_api_id parameter');
      }
      if (!season || typeof season !== 'string') {
        return res.status(400).send('Invalid season parameter');
      }
      const teams = await fetchData('apiOne',`v3/teams?league=${leage_api_id}&season=${season}`);
      if(teams.length === 0){
      res.status(404).send('No tournaments found');
    }
    else{
      for(const team of teams){
        // Save tournament to the database
        const params = [team.team.id,
          team.team.name,
          team.team.country,
          team.team.founded,
          team.venue.name,
        ];
        const insertQuery = `INSERT INTO Teams (team_api_id, team_name,country, founded_year, stadium_name) VALUES (?, ?, ?, ?, ?)`;

        await executeQuery(insertQuery, params);
      }
      res.status(201).send('Tournaments imported successfully');
    }
    } catch (error) {
      res.status(500).send('Error importing teams');
    }
}
module.exports = { importTeamsbyCountry, importTeamsbyName, importTeamsbyLeage };