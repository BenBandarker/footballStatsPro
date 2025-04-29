const axios = require('axios');
const { apiOne, apiTwo } = require('../../config/apiConfig');
const eventModel = require('../models/eventModel');

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

async function getEventsFromApi(params) {
  const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
  // Fetch events from the API
  const apiResponse = await fetchData('apiOne', `v3/fixtures/events?${queryString}`);
  return apiResponse.response;
}

async function saveEventToDatabase(match_id, event) {
  const param = [
    match_id,
    event.team.id,
    event.player.id,
    event.assist.id,
    event.type,
    event.time.elapsed,
    event.time.extra
  ];
  await eventModel.insertEvent(param);
}

async function getEventFromDb(filters) {
  return await eventModel.findEventByFilters(filters);
}

async function deleteEvent(params) {
  return await eventModel.deleteEvent(params);
}

async function updateEvent(identifiers, updateFields) {
  return await eventModel.updateEvent(identifiers, updateFields);
}

async function getTeamEventsStatistics({ groupBy, aggregates }) {
  return await teamEventsModel.getTeamEventsStatistics({ groupBy, aggregates });
}

module.exports = {
  getEventsFromApi,
  saveEventToDatabase,
  getEventFromDb,
  deleteEvent,
  updateEvent,
  getTeamEventsStatistics,
};
