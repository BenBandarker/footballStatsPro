const axios = require('axios');
const { apiOne, apiTwo } = require('../../config/apiConfig');
const Team = require('../models/teamModel');

async function fetchData(apiName, endpoint) {
  const apiConfig = apiName === 'apiOne' ? apiOne : apiTwo;

  try {
    const response = await axios.get(`${apiConfig.baseUrl}/${endpoint}`, { headers : apiConfig.headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${apiName}:`, error);
    throw new Error(error);
  }
}

async function getTeamsFromApi(params) {
  const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');

  const apiResponse = await fetchData('apiOne',`v3/teams?${queryString}`); 
  return apiResponse.response;

}

async function saveTeamToDatabase(team, venueName){
  const params = [team.id,
    team.name,
    team.country,
    team.founded,
    venueName,
  ];
  
  await Team.insertTeam(params);
}

async function getTeamsFromDb(filters) {
  return await Team.findTeamsByFilters(filters);
}

async function deleteTeamsFromDb(filters) {
  return await Team.deleteTeams(filters);
}

async function updateTeamssInDb(identifiers, updateFields) {
  return await Team.updateTeams(identifiers, updateFields);
}


module.exports = { 
  getTeamsFromApi,
  saveTeamToDatabase, 
  getTeamsFromDb,
  deleteTeamsFromDb,
  updateTeamssInDb
};