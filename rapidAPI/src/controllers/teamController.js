const teamService = require('../services/teamService');

async function importTeams(req, res) {
  try {
    const params = req.query;
    const teams = await teamService.getTeamsFromApi(params); // Fetch teams from the API

    if (!teams || teams.length === 0) {
      return res.status(404).send('No teams found');
    }

    for (const entry of teams) {
      const { team, venue } = entry;

      if (!team || !team.id) {
        console.warn('Invalid team data structure, skipping entry:', entry);
        continue;
      }

      const venueName = venue && venue.name ? venue.name : null;

      try {
        await teamService.saveTeamToDatabase(team, venueName);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`Duplicate entry for team API-ID ${team.id}, skipping...`);
        } else {
          console.error(`Error saving team API-ID ${team.id}: ${error.message}`);
          throw error;
        }
      }
    }

    res.status(201).send('Teams imported successfully');
  } catch (error) {
    console.error('Failed to import teams:', error);
    res.status(500).send('Error importing teams');
  }
}

async function searchTeams(req, res) {
  try {
    const params = req.query;

    const teams = await teamService.getTeamsFromApi(params); // Fetch teams from the API
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

    const teams = await teamService.getTeamsFromDb(params);
    res.status(200).send(teams);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting teams');
  }
}

async function deleteTeamsDb(req, res) {
  try {
    const params = req.query;

    const result = await teamService.deleteTeamsFromDb(params);
    if(result.affectedRows === 0) {
      return res.status(404).send('No teams found to delete');
    }
    res.status(200).send('Teams deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting teams');
    }
  }
  

  async function updateTeamsDb(req, res) {
    try{
      const params = req.query;

      const { team_id, team_api_id, ...updateFields} = params;
      if( !team_id && !team_api_id){
        return res.status(400).send('No fields provided for Where clause');
      }

      if(Object.keys(updateFields).length === 0){
        return res.status(400).send('No fields provided for update');
      }

      const result = await teamService.updateTeamssInDb({ team_id, team_api_id }, updateFields);
      if(result.affectedRows === 0){
        return res.status(404).send('No teams found to update');
      }
      res.status(200).send('Team updated successfully');
    } catch (error){
      console.error(error);
      res.status(400).send('Error updating team');
    }
}

module.exports = { importTeams, searchTeams, getTeamDb, deleteTeamsDb , updateTeamsDb };