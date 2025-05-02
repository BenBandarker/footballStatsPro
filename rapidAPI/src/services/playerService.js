const axios = require('axios');
const { apiOne, apiTwo } = require('../../config/apiConfig');
const Player = require('../models/playerModel');

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

async function getPlayersFromApi(params) {
  const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
  // Fetch players from the API
  const apiResponse = await fetchData('apiOne', `v3/players?${queryString}`);
  return apiResponse.response;
}

function sanitizeParams(params) {
  return params.map(value => value === undefined ? null : value);
}

function parseNumericField(value) {
  if (!value) return null;
  const parsed = parseFloat(value.toString().replace(/[^\d.]/g, ''));
  return isNaN(parsed) ? null : parsed;
}

async function savePlayerToDatabase(player) {
  const params = [player.player.id,
    player.player.firstname,
    player.player.lastname,
    player.player.birth.date,
    player.player.nationality,
    parseNumericField(player.player.height),
    parseNumericField(player.player.weight),
    player.player.photo,];
       
  await Player.insertPlayer(sanitizeParams(params));
    
}

async function getPlayersFromDb(filters) {
  return await Player.findPlayersByFilters(filters); 
}

async function deletePlayersFromDb(filters) {
  return await Player.deletePlayers(filters);
}

async function updatePlayersInDb(identifiers, updateFields) {
  return await Player.updatePlayers(identifiers, updateFields);
}

module.exports = {
  getPlayersFromApi,
  savePlayerToDatabase,
  getPlayersFromDb,
  deletePlayersFromDb,
  updatePlayersInDb,
};