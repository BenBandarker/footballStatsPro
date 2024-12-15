const axios = require('axios');
const { baseUrl, headers } = require('../config/apiConfig');

async function fetchData(endpoint) {
  try {
    const response = await axios.get(`${baseUrl}/${endpoint}`, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { fetchData };