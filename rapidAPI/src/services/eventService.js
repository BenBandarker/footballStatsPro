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
  const rawParams = [
    parseInt(match_id),                            // match_id: number
    parseInt(event?.team?.id),                     // team_id
    parseInt(event?.player?.id),                   // player_id
    parseInt(event?.assist?.id),                   // assist_id
    typeof event?.type === 'string' ? event.type : null,   // event_type
    parseInt(event?.time?.elapsed),                // event_time
    event?.time?.extra !== undefined ? parseInt(event.time.extra) : null // event_extra
  ];

  const safeParams = rawParams.map((val, idx) => {
    if (val === undefined || val === null || Number.isNaN(val)) {
      console.warn(`Param at index ${idx} is invalid (undefined/null/NaN), setting to null`);
      return null;
    }
    if (typeof val === 'object') {
      console.warn(`Param at index ${idx} is an object. Setting to null.`, val);
      return null;
    }
    return val;
  });

  if (safeParams.length !== 7) {
    console.error(`Param length mismatch: expected 7, got ${safeParams.length}`);
    return;
  }

  console.log('Attempting to insert event with params:', safeParams);

  try {
    await eventModel.insertEvent(safeParams);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      console.warn(`Skipping event: foreign key violation — likely missing player, team, or match`);
    } else if (error.code === 'ER_DUP_ENTRY') {
      console.warn(`Duplicate event found. Skipping.`);
    } else if (error.code === 'ER_MALFORMED_PACKET') {
      console.error('Malformed packet! One of the values is invalid:', safeParams);
    } else {
      console.error('Unexpected DB error:', error);
    }
  }
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
