const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

require('dotenv').config();

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

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const { executeQuery } = require('./services/databaseService');

async function initializeDatabase() {
  try {
    await createDatabaseIfNotExists();

    const schemaPath = path.join(__dirname, '../../databases/schema.sql');
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

module.exports = { initializeDatabase };
