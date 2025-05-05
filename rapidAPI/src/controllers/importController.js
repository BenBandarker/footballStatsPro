
const { importTournaments } = require('./tournamentController');
const { importTeams } = require('./teamController');
const { importPlayers } = require('./playerController');
const { importMatches } = require('./matchController');
const { importPlayersPerf } = require('./playerPerfController');
const { importTeamsStats } = require('./teamStatsController');
const { importEvent } = require('./eventController');

const { validateTeamsParamsApi } = require('../middlewares/teamValidator');
const { validatePlayParamsApi } = require('../middlewares/playerValidator');
const { validateMatParamsApi } = require('../middlewares/matchValidator');
const { validatePlayerPerfParamApi, validateTeamStatsParamsApi, validateEventParamApi } = require('../middlewares/statsValidator');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const REQUESTS_PER_MINUTE = 299; 
const MIN_DELAY_BETWEEN_REQUESTS_MS = 60000 / REQUESTS_PER_MINUTE;

let lastRequestTime = 0;

async function maybeDelay() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_DELAY_BETWEEN_REQUESTS_MS) {
    const waitTime = MIN_DELAY_BETWEEN_REQUESTS_MS - timeSinceLastRequest;
    console.log(`⌛ Waiting ${waitTime}ms to respect rate limit...`);
    await delay(waitTime);
  }

  lastRequestTime = Date.now();
}

// Import data from API and insert into the database.
// Accepts request and response objects (req, res).
// Returns appropriate HTTP response or data object.
async function importAllData(req, res) {
  try {
    const params = req.query;
    const season = params.season || new Date().getFullYear(); // Default to current year if no season is provided

    // Step 1: Import Tournaments
    await maybeDelay();
    const tournaments = await importTournaments({ query: params }, undefined, true) || [];

    for (const tournament of tournaments) {
        const leagueId = tournament.league.id;

        // Step 2: Import Teams
        const teamParams = { league: leagueId, season: season };
        const teamValidation = validateTeamsParamsApi(teamParams );
        if (!teamValidation.valid){
            console.warn(`Invalid team parameters for league ${leagueId}: ${teamValidation.message}`);
            continue;
        }

        await maybeDelay();
        const teams = await importTeams({ query: teamParams }, undefined, true) || [];

        // Step 3: Import Players per Team
        for (const team of teams) {
            const playerParams = { team: team.team.id, season: season };
            const playerValidation = validatePlayParamsApi( playerParams );
            if (!playerValidation.valid) {
                console.warn(`Invalid player parameters for team ${team.team.id}: ${playerValidation.message}`);
                continue;
            }

            await maybeDelay();
            await importPlayers({ query: playerParams }, undefined, true);
        }

        // Step 4: Import Matches for Tournament
        const matchParams = { league: leagueId, season: season };
        const matchValidation = validateMatParamsApi( matchParams );
        if (!matchValidation.valid) {
            console.warn(`Invalid match parameters for league ${leagueId}: ${matchValidation.message}`);
            continue;
        }

        await maybeDelay();
        const matches = await importMatches({ query: matchParams }, undefined, true) || [];

        // Step 5: Import stats for each match and team
        for (const match of matches) {
            const fixtureId = match.fixture.id;
            const homeId = match.teams.home.id;
            const awayId = match.teams.away.id;

            // Player performance
            const homePerf = { fixture: fixtureId, team: homeId };
            const awayPerf = { fixture: fixtureId, team: awayId };

            if (validatePlayerPerfParamApi(homePerf) ) {
                await maybeDelay();
                await importPlayersPerf({ query: homePerf }, undefined, true);
            }
            if (validatePlayerPerfParamApi( awayPerf )) {
                await maybeDelay();
                await importPlayersPerf({ query: awayPerf }, undefined, true);
            }

            // Team stats
            if (validateTeamStatsParamsApi( homePerf )) {
                await maybeDelay();
                await importTeamsStats({ query: homePerf }, undefined, true);
            }
            if (validateTeamStatsParamsApi( awayPerf )) {
                await maybeDelay();
                await importTeamsStats({ query: awayPerf }, undefined, true);
            }

            // Events
            const eventParams = { fixture: fixtureId };
            if (validateEventParamApi( eventParams ).valid) {
                await maybeDelay();
                await importEvent({ query: eventParams }, undefined, true);
            }
        }
    }

    res.status(200).send("All data imported successfully");
  } catch (error) {
    console.error("Error importing all data:", error);
    res.status(500).send("Failed to import all data");
  }
}

module.exports = { importAllData };
