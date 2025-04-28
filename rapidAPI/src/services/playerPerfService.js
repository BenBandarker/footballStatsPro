const axios = require('axios');
const { apiOne, apiTwo } = require('../../config/apiConfig');
const Stats = require('../models/playerPerfModel');

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

function buildParams(rawParams, options = {}) {
  const { floatFields = [], booleanFields = [], enumFieldIndex = null, enumMap = {} } = options;

  return rawParams.map((value, index) => {
    if (value === undefined || value === null) {
      // enumFieldIndex מחזיר null אם מדובר בשדה ENUM
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

async function savePlayerPerformanceToDatabase(player_id, match_id, stats) {
  const rawParams = [
    player_id,
    match_id,
    stats[0]?.games?.minutes,
    stats[0]?.games?.position,
    stats[0]?.games?.rating,
    stats[0]?.games?.captain,
    stats[0]?.games?.substitute,
    stats[0]?.offsides,
    stats[0]?.shots?.total,
    stats[0]?.shots?.on,
    stats[0]?.goals?.total,
    stats[0]?.goals?.conceded,
    stats[0]?.goals?.assists,
    stats[0]?.goals?.saves,
    stats[0]?.passes?.total,
    stats[0]?.passes?.key,
    stats[0]?.passes?.accuracy,
    stats[0]?.tackles?.total,
    stats[0]?.tackles?.blocks,
    stats[0]?.tackles?.interceptions,
    stats[0]?.duels?.total,
    stats[0]?.duels?.won,
    stats[0]?.dribbles?.attempts,
    stats[0]?.dribbles?.success,
    stats[0]?.dribbles?.past,
    stats[0]?.fouls?.drawn,
    stats[0]?.fouls?.committed,
    stats[0]?.cards?.yellow,
    stats[0]?.cards?.red,
    stats[0]?.penalty?.won,
    stats[0]?.penalty?.committed,
    stats[0]?.penalty?.scored,
    stats[0]?.penalty?.missed,
    stats[0]?.penalty?.saved
  ];

  const options = {
    floatFields: [4, 16],
    booleanFields: [5, 6],
    enumFieldIndex: 3,
    enumMap: { G: 'Goalkeeper', D: 'Defender', M: 'Midfielder', F: 'Forward' }
  };

  const params = buildParams(rawParams, options);

  await Stats.insertPlayerPerformance(params);
}

async function getPlayerPerformanceFromDb(filters) {
  return await Stats.getPlayerPerformance(filters);
}

async function deletePlayerPerformance(params) {
  return await Stats.deletePlayerPerformance(params);
}

async function updatePlayerPerformance(identifiers, updateFields) {
  return await Stats.updatePlayerPerformance(identifiers, updateFields);
}

async function validatePlayerPerfParamApi(params) {
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

async function validatePlayerPerformanceParamsDb(params) {
  const enumPositions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

  for (const [key, value] of Object.entries(params)) {
    switch (key) {
      case 'performance_id':
      case 'player_id':
      case 'match_id':
      case 'minutes_played':
      case 'offsides':
      case 'total_shots':
      case 'shots_on_target':
      case 'goals':
      case 'conceded_goals':
      case 'assists':
      case 'saves':
      case 'total_passes':
      case 'key_passes':
      case 'total_tackles':
      case 'blocks':
      case 'interceptions':
      case 'total_duels':
      case 'duels_won':
      case 'dribbles_attempted':
      case 'dribbles_completed':
      case 'dribble_pasts':
      case 'fouls_drawn':
      case 'fouls_committed':
      case 'yellow_cards':
      case 'red_cards':
      case 'penalty_won':
      case 'penalty_committed':
      case 'penalty_scored':
      case 'penalty_missed':
      case 'penalty_saved':
        if (value === undefined || isNaN(parseInt(value))) {
          return { valid: false, message: `Invalid or missing integer for ${key}` };
        }
        break;

      case 'position':
        if (!enumPositions.includes(value)) {
          return { valid: false, message: `Invalid position value: ${value}` };
        }
        break;

      case 'rating':
      case 'pass_accuracy':
        if (value === undefined || isNaN(parseFloat(value))) {
          return { valid: false, message: `Invalid decimal value for ${key}` };
        }
        break;

      case 'captain':
      case 'substitute':
        if (typeof value !== 'boolean' && value !== 0 && value !== 1) {
          return { valid: false, message: `Invalid boolean value for ${key}` };
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
  savePlayerPerformanceToDatabase,
  getPlayerPerformanceFromDb,
  deletePlayerPerformance,
  updatePlayerPerformance,
  validatePlayerPerfParamApi,
  validatePlayerPerformanceParamsDb,
  validateTopStatParamApi
};
