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

async function fetchPlayerPerformanceFromApi(params) {
  const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
  // Fetch players stats from the API
  const apiResponse = await fetchData('apiOne', `v3/fixtures/players?${queryString}`);
  return apiResponse.response;
}

function buildParams(rawParams, options = {}) {
  const { floatFields = [], booleanFields = [], enumFieldIndex = null, enumMap = {} } = options;

  return rawParams.map((value, index) => {
    if (value === undefined || value === null) {
      return null;
    }

    if (index === enumFieldIndex) {
      return enumMap.hasOwnProperty(value) ? enumMap[value] : null;
    }

    if (floatFields.includes(index)) {
      const floatVal = parseFloat(value);
      return isNaN(floatVal) ? null : parseFloat(floatVal.toFixed(2));
    }

    if (booleanFields.includes(index)) {
      return Boolean(value);
    }

    const intVal = parseInt(value);
    return isNaN(intVal) ? null : intVal;
  });
}

async function savePlayerPerformanceToDatabase(player_id, match_id, stats) {
  const rawParams = [
    player_id,
    match_id,
    stats?.games?.minutes,
    stats?.games?.position,
    stats?.games?.rating,
    stats?.games?.captain,
    stats?.games?.substitute,
    stats?.offsides,
    stats?.shots?.total,
    stats?.shots?.on,
    stats?.goals?.total,
    stats?.goals?.conceded,
    stats?.goals?.assists,
    stats?.goals?.saves,
    stats?.passes?.total,
    stats?.passes?.key,
    stats?.passes?.accuracy,
    stats?.tackles?.total,
    stats?.tackles?.blocks,
    stats?.tackles?.interceptions,
    stats?.duels?.total,
    stats?.duels?.won,
    stats?.dribbles?.attempts,
    stats?.dribbles?.success,
    stats?.dribbles?.past,
    stats?.fouls?.drawn,
    stats?.fouls?.committed,
    stats?.cards?.yellow,
    stats?.cards?.red,
    stats?.penalty?.won,
    stats?.penalty?.committed,
    stats?.penalty?.scored,
    stats?.penalty?.missed,
    stats?.penalty?.saved
  ];

  const options = {
    floatFields: [4, 16],
    booleanFields: [5, 6],
    enumFieldIndex: 3,
    enumMap: { G: 'Goalkeeper', D: 'Defender', M: 'Midfielder', F: 'Forward' }
  };

  const params = buildParams(rawParams, options);
  if (params.length !== 34) {
    console.error(` Param count mismatch! Got ${params.length} instead of 35`);
    console.log('Params:', params);
    // logSkippedPlayer(player_id, match_id, `Param count mismatch: got ${params.length}`);
    return;
  }
  
  try {
    await Stats.insertPlayerPerformance(params);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      console.warn(` Skipping player ${player_id} — not found in Players table`);
      // logSkippedPlayer(player_id, match_id, 'Player not found in Players table (FK error)');
      return;
    } else if (error.code === 'ER_DUP_ENTRY') {
      console.log(` Duplicate entry for player ${player_id} & match ${match_id}, skipping...`);
      return;
    } else {
      console.error(` Error saving player ${player_id} in match ${match_id}: ${error.message}`);
      throw error;
    }
  }
}

async function getPlayerPerformanceFromDb(filters) {
  return await Stats.findPlayerPerformanceByFilters(filters);
}

async function deletePlayerPerformance(params) {
  return await Stats.deletePlayerPerformance(params);
}

async function updatePlayerPerformance(identifiers, updateFields) {
  return await Stats.updatePlayerPerformance(identifiers, updateFields);
}

async function getPlayerPerformanceStatistics({ groupBy, aggregates }) {
  return await playerPerformanceModel.getPlayerPerformanceStatistics({ groupBy, aggregates });
}

module.exports = {
  fetchPlayerPerformanceFromApi,
  savePlayerPerformanceToDatabase,
  getPlayerPerformanceFromDb,
  deletePlayerPerformance,
  updatePlayerPerformance,
  getPlayerPerformanceStatistics,
};
