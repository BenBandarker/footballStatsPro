const express = require('express');
const { initializeDatabase } = require('./services/databaseService');
const tournamentsRoutes = require('./routes/tournamentRoutes');
const teamsRoutes = require('./routes/teamRoutes');
const playersRoutes = require('./routes/playerRoutes');
const matchesRoutes = require('./routes/matchRoutes');
const statsRoutes = require('./routes/statsRoutes');
const { importAllData } = require('./controllers/importController');
const { validateTournamentParamsApi } = require('./middlewares/tournamentValidator');

require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use('/tournaments', tournamentsRoutes);
app.use('/teams', teamsRoutes);
app.use('/players', playersRoutes);
app.use('/matches', matchesRoutes);
app.use('/stats', statsRoutes);

// Route for full data import
app.post('/importAll', validateTournamentParamsApi, importAllData);

try{
  initializeDatabase().then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  });
} catch (error) {
  console.error('Error starting server:', error);
}
