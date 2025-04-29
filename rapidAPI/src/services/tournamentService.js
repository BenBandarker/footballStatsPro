const axios = require('axios');
const { apiOne, apiTwo } = require('../../config/apiConfig');
const Tournament = require('../models/tournamentModel');

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

async function getTournamentsFromApi(params) {
  // Build query string for API call
  const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');

  // Fetch tournaments from the API
  const apiResponse = await tournamentService.fetchData('apiOne', `v3/leagues?${queryString}`);
  return apiResponse.response;
}

// Saves a single tournament to the database by extracting key details:
// league ID and name, latest season start/end dates, and country name.
async function saveTournamentToDatabase(tournament) {
  const params = [
    tournament.league.id,
    tournament.league.name,
    tournament.seasons[tournament.seasons.length - 1].start,
    tournament.seasons[tournament.seasons.length - 1].end,
    tournament.country.name,
  ];

  await Tournament.insertTournament(params);
}

async function getTournamentsFromDb(filters) {
  return await Tournament.findTournamentsByFilters(filters);
}

async function deleteTournamentsFromDb(filters) {
  return await Tournament.deleteTournaments(filters);
}

async function updateTournamentsInDb(identifiers, updateFields) {
  return await Tournament.updateTournaments(identifiers, updateFields);
}



module.exports = {
  saveTournamentToDatabase,
  getTournamentsFromDb,
  deleteTournamentsFromDb,
  updateTournamentsInDb,
  getTournamentsFromApi
};