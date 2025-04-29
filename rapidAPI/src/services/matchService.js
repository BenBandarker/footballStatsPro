const axios = require('axios');
const { apiOne, apiTwo } = require('../../config/apiConfig');
const Match = require('../models/matchModel');

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

async function getMatchesFromApi(params) {
  const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
  // Fetch matches from the API
  const apiResponse = await matchService.fetchData('apiOne', `v3/fixtures?${queryString}`);
  return apiResponse.response;
}

function getMatchType(value) {
    const statusMap = {
      // SHORT : [LONG, TYPE]
      TBD: ["Time To Be Defined", "Scheduled"],
      NS: ["Not Started", "Scheduled"],
      "1H": ["First Half, Kick Off", "In Play"],
      HT: ["Halftime", "In Play"],
      "2H": ["Second Half, 2nd Half Started", "In Play"],
      ET: ["Extra Time", "In Play"],
      BT: ["Break Time", "In Play"],
      P: ["Penalty In Progress", "In Play"],
      SUSP: ["Match Suspended", "In Play"],
      INT: ["Match Interrupted", "In Play"],
      FT: ["Match Finished", "Finished"],
      AET: ["Match Finished", "Finished"],
      PEN: ["Match Finished", "Finished"],
      PST: ["Match Postponed", "Postponed"],
      CANC: ["Match Cancelled", "Cancelled"],
      ABD: ["Match Abandoned", "Abandoned"],
      AWD: ["Technical Loss", "Not Played"],
      WO: ["WalkOver", "Not Played"],
      LIVE: ["In Progress", "In Play"]
    };
  
    for (const [shortKey, [longVal, typeVal]] of Object.entries(statusMap)) {
      if (value === shortKey || value === longVal) {
        return typeVal;
      }
    }
  
    return "Unknown"; // Default value if no match type is found0
  }

async function saveMatchToDatabase(match) {
  const params = [
    match.fixture.id,
    match.teams.home.id,
    match.teams.away.id,
    match.league.id,
    match.fixture.date,
    match.fixture.timestamp,
    getMatchType(match.fixture.status.long),
    match.goals.home,
    match.goals.away,
  ];

  await Match.insertMatch(params);
}

async function getMatchesFromDb(filters) {
  return await Match.findMatchesByFilters(filters); 
}

async function deleteMatchesFromDb(filters) {
  return await Match.deleteMatches(filters);
}

async function updateMatchesInDb(identifiers, updateFields) {
  return await Match.updateMatches(identifiers, updateFields);
}

module.exports = {
  getMatchesFromApi,
  saveMatchToDatabase,
  getMatchesFromDb,
  deleteMatchesFromDb,
  updateMatchesInDb,
};