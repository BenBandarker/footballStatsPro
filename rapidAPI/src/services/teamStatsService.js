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

function buildParams(rawParams, options = {}) { // **************** */
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

async function validateTeamStatsParamsApi(params) { //**************** */
  if(!params.fixture || !params.team) {
    return { valid: false, message: 'Missing required parameters: fixture and team' };
  }
  
  for (const [key, value] of Object.entries(params)) {
    switch(key) {
      case 'fixture':
        fix_value = parseInt(value);
        if (!value || typeof fix_value !== 'number') {
          return { valid: false, message: 'Invalid fixture parameter' };
        }
        break;
      case 'team':
        team_value = parseInt(value);
        if (!value || typeof team_value !== 'number') {
          return { valid: false, message: 'Invalid team parameter' };
        }
        break;
      default:
        return { valid: false, message: `Unknown parameter: ${key}` };
    }
  }
  return { valid: true };
}

async function validateTeamMatchStatsParamsDb(params) {
  for (const [key, value] of Object.entries(params)) {
    switch (key) {
      case 'stat_id':
      case 'match_id':
      case 'team_id':
      case 'shots_on_goal':
      case 'shots_off_goal':
      case 'total_shots':
      case 'blocked_shots':
      case 'shots_insidebox':
      case 'shots_outsidebox':
      case 'fouls':
      case 'corner_kicks':
      case 'offsides':
      case 'yellow_cards':
      case 'red_cards':
      case 'goalkeeper_saves':
      case 'total_passes':
      case 'passes_accurate':
        if (value === undefined || isNaN(parseInt(value))) {
          return { valid: false, message: `Invalid or missing integer for ${key}` };
        }
        break;

      case 'ball_possession':
      case 'pass_accuracy':
        if (value === undefined || isNaN(parseFloat(value))) {
          return { valid: false, message: `Invalid decimal value for ${key}` };
        }
        break;

      default:
        return { valid: false, message: `Unknown or invalid parameter: ${key}` };
    }
  }

  return { valid: true };
}

async function validateTopStatParamApi(params) {
  const currentYear = new Date().getFullYear();
  if(!params.league || !params.season) {
    return { valid: false, message: 'Missing required parameters: league and season' };
  }
  for (const [key, value] of Object.entries(params)) {
    switch(key) {
      case 'league':
        league_value = parseInt(value);
        if (!value || typeof league_value !== 'number') {
          return { valid: false, message: 'Invalid league parameter' };
        }
        break;
      case 'season':
        num_value = parseInt(value);
        if (!num_value || typeof num_value !== 'number' || num_value < 2010 || num_value > currentYear) {
          return { valid: false, message: 'Invalid season parameter. Make sure the season is between 2010 and the current year.' };
        }
        break;
      default:
        return { valid: false, message: `Unknown parameter: ${key}` };
    }
  }
  return { valid: true };
}

module.exports = {
  fetchData,
  saveTeamStatsToDatabase,
  getTeamStatsFromDb,
  deleteTeamStatsFromDb,
  updateTeamStatsInDb,
  validateTeamStatsParamsApi,
  validateTeamMatchStatsParamsDb,
  validateTopStatParamApi // ***
};
