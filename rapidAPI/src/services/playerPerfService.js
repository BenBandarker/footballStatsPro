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
