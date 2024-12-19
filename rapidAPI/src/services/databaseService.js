const mysql = require('mysql2/promise');

// Create a database connection pool
const pool = mysql.createPool({
  host: 'localhost',       // Replace with your database host
  user: 'root',            
  password: '318468758',    
  database: 'db_football_stats', 
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

module.exports = { executeQuery };
