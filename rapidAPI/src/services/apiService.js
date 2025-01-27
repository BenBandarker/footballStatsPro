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

// Function to validate request parameters for the API
function validateTournamentParamsApi(params) {
  const currentYear = new Date().getFullYear();

  for (const [key, value] of Object.entries(params)) {
    switch (key) {
      case 'id':
        id_value = parseInt(value);
        if (!value || typeof id_value !== 'number') {
          return { valid: false, message: 'Invalid id parameter' };
        }
        break;
      case 'name':
        if (!value || typeof value !== 'string') {
          return { valid: false, message: 'Invalid name parameter' };
        }
        break;
      case 'country':
        if (!value || typeof value !== 'string') {
          return { valid: false, message: 'Invalid country parameter' };
        }
        break;
      case 'season':
        num_value = parseInt(value);
        if (!num_value || typeof num_value !== 'number' || num_value < 2010 || num_value > currentYear) {
          return { valid: false, message: 'Invalid season parameter. Make sure the season is between 2010 and the current year.' };
        }
        break;
      case 'type':
        if (!value || typeof value !== 'string' || !['league', 'cup'].includes(value)) {
          return { valid: false, message: 'Invalid type parameter' };
        }
        break;
      case 'current':
        if (!value || typeof value !== 'string' || !['true', 'false'].includes(value)) {
          return { valid: false, message: 'Invalid current parameter' };
        }
        break;
      case 'search':
        if (!value || typeof value !== 'string' || value.length < 3) {
          return { valid: false, message: 'Invalid search parameter' };
        }
        break;
      default:
        return { valid: false, message: `Unknown or invalid parameter: ${key}` };
    }
  }

  return { valid: true };
}

// Function to validate request parameters for the API
function validateTeamsParamsApi(params) {
  const currentYear = new Date().getFullYear();

  for (const [key, value] of Object.entries(params)) {
    switch (key) {
      case 'id':
        id_value = parseInt(value);
        if (!value || typeof id_value !== 'number') {
          return { valid: false, message: 'Invalid id parameter' };
        }
        break;
      case 'name':
        if (!value || typeof value !== 'string') {
          return { valid: false, message: 'Invalid name parameter' };
        }
        break;
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
      case 'country':
        if (!value || typeof value !== 'string') {
          return { valid: false, message: 'Invalid country parameter' };
        }
        break;
      case 'search': 
        if (!value || typeof value !== 'string' || value.length < 3) {
          return { valid: false, message: 'Invalid search parameter' };
        }
        break;
      default:
        return { valid: false, message: `Unknown or invalid parameter: ${key}` };
    }
  }

  return { valid: true };
}

module.exports = { fetchData, validateTournamentParamsApi, validateTeamsParamsApi };