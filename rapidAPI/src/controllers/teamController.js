const { fetchData, saveTeamToDatabase, validateTeamsParamsApi, validateTeamsParamsDb } = require('../services/teamService');
const { executeQuery } = require('../services/databaseService');

async function importTeams(req, res) {
  try {
    const params = req.query;
    const validate = validateTeamsParamsApi(params);
    if (!validate.valid) {
      return res.status(400).send(validate.message);
    }
    const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');

    const apiResponse = await fetchData('apiOne',`v3/teams?${queryString}`); 
    const teams = apiResponse.response;

    if(teams.length === 0){
      res.status(404).send('No teams found');
    }
    else{
      for(const { team, venue } of teams){
        try {
          await saveTeamToDatabase(team, venue.name); // Attempt to save the team
        } catch (error) {
          // Handle duplicate entry error and log the skipped team
          if (error.code === 'ER_DUP_ENTRY') {
            console.log(`Duplicate entry for team API-ID ${team.team.id}, skipping...`);
          } else {
            console.error(`Error saving team API-ID ${team.team.id}: ${error.message}`);
            throw error; 
          }
        }
      }
      res.status(201).send('Teams imported successfully');
    }
  } catch (error) {
    res.status(500).send('Error importing teams');
  }
}

async function searchTeams(req, res) {
  try {
    const params = req.query;
    const validate = validateTeamsParamsApi(params);
    if (!validate.valid) {
      return res.status(400).send(validate.message);
    }
    const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');

    const apiResponse = await fetchData('apiOne',`v3/teams?${queryString}`); 
    const teams = apiResponse.response
    if(teams.length === 0){
      res.status(404).send('No teams found');
    }
    else{
      res.status(200).send(teams);
    }
  } catch (error) {
    res.status(500).send('Error importing teams');
  }
}

async function getTeamDb(req, res) {
  try {
    const params = req.query; // Get dynamic parameters from req.query
    const validation = validateTeamsParamsDb(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }

    const queryBase = 'SELECT * FROM Teams';
    const queryConditions = [];
    const queryParams = [];

    // Build the WHERE clause dynamically
    for (const [key, value] of Object.entries(params)) {
      queryConditions.push(`${key} = ?`);                          
      queryParams.push(decodeURIComponent(value)); // decodeURIComponent needed to handle values with spaces
    }

    // Combine the base query with conditions if any
    const query = queryConditions.length > 0 ? `${queryBase} WHERE ${queryConditions.join(' AND ')}` : queryBase;

    const tournaments = await executeQuery(query, queryParams);

    res.status(200).send(tournaments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting teams');
  }
}

async function deleteTeamsDb(req, res) {
  try {
    const params = req.query;
    const validation = validateTeamsParamsDb(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    const queryConditions = [];
    const queryParams = [];

    for (const [key, value] of Object.entries(params)) {
      queryConditions.push(`${key} = ?`);
      queryParams.push(decodeURIComponent(value)); // decodeURIComponent needed to handle values with spaces 
    }

    if(queryConditions.length === 0) {
      return res.status(400).send('No parameters provided for deletion');
    }

    const query = `DELETE FROM Teams WHERE ${queryConditions.join(' AND ')}`;
    await executeQuery(query, queryParams);

    res.status(200).send('Teams deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting teams');
    }
  }
  

  async function updateTeamsDb(req, res) {
    try{
      const params = req.query;
      const validation = validateTeamsParamsDb(params);
      if(!validation.valid){
        return res.status(400).send(validation.message);
      }

      const { team_id, team_api_id, ...updateFields} = params;
      if( !team_id && !team_api_id){
        return res.status(400).send('No fields provided for Where clause');
      }

      if(Object.keys(updateFields).length === 0){
        return res.status(400).send('No fields provided for update');
      }

      const setClauses = [];
      const values = [];
      for( const [key, value] of Object.entries(updateFields)) {
        setClauses.push(`${key} = ?`);
        values.push(decodeURIComponent(value)); // decodeURIComponent needed to handle values with spaces
      }

      const whereClauses = [];
      if(team_id) {
        whereClauses.push('team_id = ?');
        values.push(team_id);
      }
      if(team_api_id){
        whereClauses.push('team_api_id = ?');
        values.push(team_api_id);
      }

      const updateQuery = `
      UPDATE Teams
      SET ${setClauses.join(', ')}
      where ${whereClauses.join(' AND ')}
      `;
      await executeQuery(updateQuery, values);
      res.status(200).send('Team updated successfully');
    } catch (error){
      console.error(error);
      res.status(400).send('Error updating team');
    }
}

module.exports = { importTeams, searchTeams, getTeamDb, deleteTeamsDb , updateTeamsDb };