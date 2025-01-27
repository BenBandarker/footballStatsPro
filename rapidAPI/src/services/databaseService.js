const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,     // Maximum number of connections in the pool
  queueLimit: 0            // No limit on queued requests
});

// Execute an SQL query
async function executeQuery(query, params) {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error; // Re-throw error to handle it in the calling function
  }
}

// Function to validate request parameters for the database
function validateTournamentParamsDb(params) {
  for (const [key, value] of Object.entries(params)) {
    switch (key) {
      case 'tournament_id':
        id_value = parseInt(value);
        if (!value || typeof id_value !== 'number') {
          return { valid: false, message: 'Invalid tournament_id parameter' };
        }
        break;
      case 'tournament_api_id':
        id_api_value = parseInt(value);
        if (!value || typeof id_api_value !== 'number') {
          return { valid: false, message: 'Invalid tournament_api_id parameter' };
        }
        break;
      case 'tournament_name':
        if (!value || typeof value !== 'string') {
          return { valid: false, message: 'Invalid tournament_name parameter' };
        }
        break;
      case 'location':
        if (!value || typeof value !== 'string') {
          return { valid: false, message: 'Invalid location parameter' };
        }
        break;
      default:
        return { valid: false, message: `Unknown or invalid parameter: ${key}` };
    }
  }

  return { valid: true };
}

// Function to validate request parameters for the database
function validateTeamsParamsDb(params) {
  for (const [key, value] of Object.entries(params)) {
    switch (key) {
      case 'team_id':
        id_value = parseInt(value);
        if (!value || typeof id_value !== 'number') {
          return { valid: false, message: 'Invalid tournament_id parameter' };
        }
        break;
      case 'team_api_id':
        id_api_value = parseInt(value);
        if (!value || typeof id_api_value !== 'number') {
          return { valid: false, message: 'Invalid tournament_api_id parameter' };
        }
        break;
      case 'team_name':
        if (!value || typeof value !== 'string') {
          return { valid: false, message: 'Invalid tournament_name parameter' };
        }
        break;
      case 'country':
        if (!value || typeof value !== 'string') {
          return { valid: false, message: 'Invalid location parameter' };
        }
        break;
      case 'founded_year':
        founded_value = parseInt(value);
        if (!value || typeof founded_value !== 'number') {
          return { valid: false, message: 'Invalid founded_year parameter' };
        }
        break;
      case 'stadium_name':
        if (!value || typeof value !== 'string') {
          return { valid: false, message: 'Invalid stadium_name parameter' };
        }
      default:
        return { valid: false, message: `Unknown or invalid parameter: ${key}` };
    }
  }

  return { valid: true };
}


module.exports = { executeQuery , validateTournamentParamsDb , validateTeamsParamsDb };
