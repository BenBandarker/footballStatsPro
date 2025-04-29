
// Function to validate request parameters for the API
function validateParamsApi(params) {
  const currentYear = new Date().getFullYear();

  for (const [key, value] of Object.entries(params)) {
    switch (key) {
      case 'id':
        id_value = parseInt(value);
        if (!value || typeof id_value !== 'number') {
          return { valid: false, message: 'Invalid id parameter' };
        }
        break;
      case 'team':
        team_value = parseInt(value)
        if (!team_value || typeof team_value !== 'number') {
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

// Function to validate request parameters for the database
function validateParamsDb(params) {
  for (const [key, value] of Object.entries(params)) {
    switch (key) {
      case 'player_id':
        id_value = parseInt(value);
        if (!value || typeof id_value !== 'number') {
          return { valid: false, message: 'Invalid player_id parameter' };
        }
        break;
      case 'player_api_id':
        id_api_value = parseInt(value);
        if (!value || typeof id_api_value !== 'number') {
          return { valid: false, message: 'Invalid player_api_id parameter' };
        }
        break;
      case 'player_Fname':
        if (!value || typeof value !== 'string') {
          return { valid: false, message: 'Invalid player first name parameter' };
        }
        break;
      case 'player_Lname':
        if (!value || typeof value !== 'string') {
          return { valid: false, message: 'Invalid player last name parameter' };
        }
        break;
        case 'date_of_birth':
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!value || typeof value !== 'string' || !dateRegex.test(value)) {
            return { valid: false, message: 'Invalid date_of_birth format. Expected format: YYYY-MM-DD' };
          }
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            return { valid: false, message: 'Invalid date_of_birth value. Not a real date.' };
          }
          break;
      case 'nationality':
        if (!value || typeof value !== 'string') {
          return { valid: false, message: 'Invalid nationality parameter' };
        }
        break;
      case 'height':
        height_value = parseInt(value);
        if (!value || typeof height_value !== 'number') {
          return { valid: false, message: 'Invalid height parameter' };
        }
        break;
      case 'weight':
        weight_value = parseInt(value);
        if (!value || typeof weight_value !== 'number') {
          return { valid: false, message: 'Invalid weight parameter' };
        }
        break;
      case 'photo_url':
        if (!value || typeof value !== 'string') {
          return { valid: false, message: 'Invalid photo_url parameter' };
        }
        break;
      default:
        return { valid: false, message: `Unknown or invalid parameter: ${key}` };
    }
  }

  return { valid: true };
}

function validatePlayerParamsApi(req, res, next) {
  const validation = validateParamsApi(req.query);
  if (!validation.valid) {
    return res.status(400).send(validation.message);
  }
  next();
}

function validatePlayerParamsDb(req, res, next) {
  const validation = validateParamsDb(req.query);
  if (!validation.valid) {
    return res.status(400).send(validation.message);
  }
  next();
}

module.exports = {
  validatePlayerParamsApi,
  validatePlayerParamsDb,
};