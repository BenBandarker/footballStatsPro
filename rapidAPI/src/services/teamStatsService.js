const axios = require('axios');
const { apiOne, apiTwo } = require('../../config/apiConfig');
const Stats = require('../models/teamStatsModel');

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

async function fetchTeamStatsFromApi(params) {
  const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    
  const apiResponse = await fetchData('apiOne', `v3/fixtures/statistics?${queryString}`);
  return apiResponse.response;
}

function buildParams(rawParams, options = {}) { 
  const { floatFields = [], booleanFields = [], enumFieldIndex = null, enumMap = {} } = options;

  return rawParams.map((value, index) => {
    if (value === undefined || value === null) {
      return (index === enumFieldIndex) ? null : 0;
    }
    if (index === enumFieldIndex && enumMap[value]) {
      return enumMap[value];
    }
    if (floatFields.includes(index)) {
      return parseFloat(parseFloat(value).toFixed(2));
    }
    if (booleanFields.includes(index)) {
      return Boolean(value);
    }
    return parseInt(value);
  });
}


async function saveTeamStatsToDatabase(match_id, response) {
  const rawParams = [
    match_id,
    response.team.id,
    response.statistics?.[0]?.value,
    response.statistics?.[1]?.value,
    response.statistics?.[2]?.value,
    response.statistics?.[3]?.value,
    response.statistics?.[4]?.value,
    response.statistics?.[5]?.value,
    response.statistics?.[6]?.value,
    response.statistics?.[7]?.value,
    response.statistics?.[8]?.value,
    response.statistics?.[9]?.value,  // ball_possession (percent)
    response.statistics?.[10]?.value,
    response.statistics?.[11]?.value,
    response.statistics?.[12]?.value,
    response.statistics?.[13]?.value,
    response.statistics?.[14]?.value,
    response.statistics?.[15]?.value   // pass_accuracy (percent)
  ];

  const options = {
    floatFields: [11, 17]
  };

  const params = buildParams(rawParams, options);

  await Stats.insertTeamStats(params);
}

async function getTeamStatsFromDb(filters) {
  return await Stats.findTeamStatsByFilters(filters);
}

async function deleteTeamStatsFromDb(filters) {
  return await Stats.deleteTeamStats(filters);
}

async function updateTeamStatsInDb(identifiers, updateFields) {
  return await Stats.updateTeamStats(identifiers, updateFields);
}

async function getTeamMatchStatsStatistics({ groupBy, aggregates }) {
  return await teamMatchStatsModel.getTeamMatchStatsStatistics({ groupBy, aggregates });
}

module.exports = {
  fetchTeamStatsFromApi,
  saveTeamStatsToDatabase,
  getTeamStatsFromDb,
  deleteTeamStatsFromDb,
  updateTeamStatsInDb,
  getTeamMatchStatsStatistics,
};
