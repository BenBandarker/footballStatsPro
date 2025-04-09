const fs = require('fs');
const path = require('path');
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

async function createDatabaseIfNotExists() {
  try {
      const connection = await mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
      });

      // Create the database if it doesn't exist
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
      console.log(`Database '${process.env.DB_NAME}' created or already exists.`);
      connection.end();
  } catch (error) {
      console.error('Error creating database:', error);
      throw error;
  }
}

async function initializeDatabase() {
  try {
    await createDatabaseIfNotExists();

    const schemaPath = path.join(__dirname, '../../../databases/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    const queries = schemaSQL.split(/;\r?\n/).filter((query) => query.trim() !== '');
    for (const query of queries) {
      await executeQuery(query);
    }

    console.log('Database schema initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

module.exports = { 
  executeQuery,
  initializeDatabase 
};
