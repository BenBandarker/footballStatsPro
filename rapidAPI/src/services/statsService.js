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
  validateTopStatParamApi,
};
