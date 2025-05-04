
function validateMatParamsApi(params) {
  if (!params || typeof params !== 'object') {
    return { valid: false, message: 'Params object is missing or invalid' };
  }
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

function validateParamsDb(params) {
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


function validateMatchParamsApi(req, res, next) {
  const validation = validateMatParamsApi(req.query);
  if (!validation.valid) {
    return res.status(400).send(validation.message);
  }
  next();
}

function validateMatchParamsDb(req, res, next) {
  const validation = validateParamsDb(req.query);
  if (!validation.valid) {
    return res.status(400).send(validation.message);
  }
  next();
}

module.exports = {
  validateMatchParamsApi,
  validateMatParamsApi,
  validateMatchParamsDb,
};