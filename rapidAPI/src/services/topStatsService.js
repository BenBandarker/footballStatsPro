const axios = require('axios');
const { apiOne, apiTwo } = require('../../config/apiConfig');

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

async function getTopGoalsFromApi(params) {
  const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
  // Fetch events from the API
  const apiResponse = await fetchData('apiOne', `v3/players/topscorers?${queryString}`);
  return apiResponse.response;
}

async function getTopAssistsFromApi(params) {
  const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
  // Fetch events from the API
  const apiResponse = await fetchData('apiOne', `v3/players/topassists?${queryString}`);
  return apiResponse.response;
}

async function getTopRedCardsFromApi(params) {
  const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
  // Fetch events from the API
  const apiResponse = await fetchData('apiOne', `v3/players/topredcards?${queryString}`);
  return apiResponse.response;
}

async function getTopYellowCardsFromApi(params) {
  const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
  // Fetch events from the API
  const apiResponse = await fetchData('apiOne', `v3/players/topyellowcards?${queryString}`);
  return apiResponse.response;
}

async function getStandingsFromApi(params) {
  const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
  // Fetch events from the API
  const apiResponse = await fetchData('apiOne', `v3/standings?${queryString}`);
  return apiResponse.response;
}

module.exports = {
  getTopGoalsFromApi,
  getTopAssistsFromApi,
  getTopRedCardsFromApi,
  getTopYellowCardsFromApi,
  getStandingsFromApi,
};
