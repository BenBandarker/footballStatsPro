const express = require('express');
const { initializeDatabase } = require('./initializeDatabase.js');
const tournamentsRoutes = require('./routes/tournamentRoutes');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use('/tournaments', tournamentsRoutes);
try{
  initializeDatabase().then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  });
} catch (error) {
  console.error('Error starting server:', error);
}
