const fs = require('fs');
const path = require('path');
const { executeQuery } = require('./services/databaseService');

async function initializeDatabase() {
  try {
    await executeQuery(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await executeQuery(`USE ${process.env.DB_NAME}`);


    const schemaPath = path.join(__dirname, '../databases/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    const queries = schemaSQL.split(';').filter((query) => query.trim() !== '');
    for (const query of queries) {
      await executeQuery(query);
    }

    console.log('Database schema initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

module.exports = { initializeDatabase };
