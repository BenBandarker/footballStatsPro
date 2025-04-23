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

async function saveMatchToDatabase(match) {
  const params = [
    match.fixture.id,
    match.teams.home.id,
    match.teams.away.id,
    match.league.id,
    match.fixture.date,
    match.fixture.timestamp,
    match.fixture.status.long, // Need to check if this is the correct field
    match.goals.home,
    match.goals.away,
  ];

  await Match.insertMatch(params);
}
