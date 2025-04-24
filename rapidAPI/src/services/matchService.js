const axios = require('axios');
const { apiOne, apiTwo } = require('../../config/apiConfig');
const Match = require('../models/matchModel');

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

function getMatchType(value) {
    const statusMap = {
      // SHORT : [LONG, TYPE]
      TBD: ["Time To Be Defined", "Scheduled"],
      NS: ["Not Started", "Scheduled"],
      "1H": ["First Half, Kick Off", "In Play"],
      HT: ["Halftime", "In Play"],
      "2H": ["Second Half, 2nd Half Started", "In Play"],
      ET: ["Extra Time", "In Play"],
      BT: ["Break Time", "In Play"],
      P: ["Penalty In Progress", "In Play"],
      SUSP: ["Match Suspended", "In Play"],
      INT: ["Match Interrupted", "In Play"],
      FT: ["Match Finished", "Finished"],
      AET: ["Match Finished", "Finished"],
      PEN: ["Match Finished", "Finished"],
      PST: ["Match Postponed", "Postponed"],
      CANC: ["Match Cancelled", "Cancelled"],
      ABD: ["Match Abandoned", "Abandoned"],
      AWD: ["Technical Loss", "Not Played"],
      WO: ["WalkOver", "Not Played"],
      LIVE: ["In Progress", "In Play"]
    };
  
    for (const [shortKey, [longVal, typeVal]] of Object.entries(statusMap)) {
      if (value === shortKey || value === longVal) {
        return typeVal;
      }
    }
  
    return "Unknown"; // Default value if no match type is found0
  }

async function saveMatchToDatabase(match) {
  const params = [
    match.fixture.id,
    match.teams.home.id,
    match.teams.away.id,
    match.league.id,
    match.fixture.date,
    match.fixture.timestamp,
    getMatchType(match.fixture.status.long),
    match.goals.home,
    match.goals.away,
  ];

  await Match.insertMatch(params);
}

async function getMatchesFromDb(filters) {
  return await Match.findMatchesByFilters(filters); 
}

async function deleteMatchesFromDb(filters) {
  return await Match.deleteMatches(filters);
}

async function updateMatchesInDb(identifiers, updateFields) {
  return await Match.updateMatches(identifiers, updateFields);
}

function validateMatchesParamsApi(params) {
    const currentYear = new Date().getFullYear();

    for (const [key, value] of Object.entries(params)) {
        switch (key) {
        case 'id':
            id_value = parseInt(value);
            if (!value || typeof id_value !== 'number') {
            return { valid: false, message: 'Invalid id parameter' };
            }
            break;
        case 'date':
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!value || typeof value !== 'string' || !dateRegex.test(value)) {
              return { valid: false, message: 'Invalid date format. Expected format: YYYY-MM-DD' };
            }
            const date = new Date(value);
            if (isNaN(date.getTime())) {
              return { valid: false, message: 'Invalid date value. Not a real date.' };
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
        case 'team': 
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

function validateMatchesParamsDb(params) {
    for (const [key, value] of Object.entries(params)) {
        switch (key) {
        case 'match_id':
            id_value = parseInt(value);
            if (!value || typeof id_value !== 'number') {
            return { valid: false, message: 'Invalid match_id parameter' };
            }
            break;
        case 'match_api_id':
            id_api_value = parseInt(value);
            if (!value || typeof id_api_value !== 'number') {
            return { valid: false, message: 'Invalid match_api_id parameter' };
            }
            break;
        case 'home_team_id':
            id_home_value = parseInt(value);
            if (!value || typeof id_home_value !== 'number') {
            return { valid: false, message: 'Invalid home_team_id parameter' };
            }
            break;
        case 'away_team_id':
            id_away_value = parseInt(value);
            if (!value || typeof id_away_value !== 'number') {
            return { valid: false, message: 'Invalid away_team_id parameter' };
            }
            break;
        case 'tournament_id':
            id_tournament_value = parseInt(value);
            if (!value || typeof id_tournament_value !== 'number') {
                return { valid: false, message: 'Invalid tournament_id parameter' };
              }
              break;
        case 'match_date':
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!value || typeof value !== 'string' || !dateRegex.test(value)) {
            return { valid: false, message: 'Invalid match_date format. Expected format: YYYY-MM-DD' };
          }
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            return { valid: false, message: 'Invalid match_date value. Not a real date.' };
          }
          break;
        case 'match_time':
          const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
          if (!value || typeof value !== 'string' || !timeRegex.test(value)) {
            return { valid: false, message: 'Invalid match_time format. Expected format: HH:mm:ss' };
          }
          break;
        case 'match_status':
            const validTypes = [
                "Scheduled",
                "In Play",
                "Finished",
                "Postponed",
                "Cancelled",
                "Abandoned",
                "Not Played"
            ];
            if (!value || typeof value !== 'string' || !validTypes.includes(value)) {
            return { valid: false, message: 'Invalid match_status parameter' };
            }
            break;
        case 'home_team_score':
            home_score_value = parseInt(value);
            if (!value || typeof home_score_value !== 'number') {
            return { valid: false, message: 'Invalid home_team_score parameter' };
            }
            break;
        case 'away_team_score':
            away_score_value = parseInt(value);
            if (!value || typeof away_score_value !== 'number') {
            return { valid: false, message: 'Invalid away_team_score parameter' };
            }
            break;
        default:
            return { valid: false, message: `Unknown or invalid parameter: ${key}` };
        }
    }
    return { valid: true };
}

module.exports = {
  fetchData,
  saveMatchToDatabase,
  getMatchesFromDb,
  deleteMatchesFromDb,
  updateMatchesInDb,
  validateMatchesParamsApi,
  validateMatchesParamsDb
};