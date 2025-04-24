const matchService = require('../services/matchService');

async function importMatches(req, res) {
  try{
    const params = req.query;
    // Validate parameters
    const validation = matchService.validateMatchesParamsApi(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    // Build query string for API call
    const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    // Fetch matches from the API
    const apiResponse = await matchService.fetchData('apiOne', `v3/fixtures?${queryString}`);
    const matches = apiResponse.response;
    if (matches.length === 0) {
      return res.status(404).send('No matches found');
    }
    // Save matches to the database
    for (const match of matches) {
      try {
        await matchService.saveMatchToDatabase(match); // Attempt to save the match
      } catch (error) {
        // Handle duplicate entry error and log the skipped match
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`Duplicate entry for match API-ID ${match.match_id}, skipping...`);
        } else {
          console.error(`Error saving match API-ID ${match.match_id}: ${error.message}`);
          throw error; 
        }
      }
    }
    res.status(201).send('Matches imported successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error importing matches');
  }
}

async function searchMatches(req, res) {
  try {
    const params = req.query;
    // Validate parameters
    const validation = matchService.validateMatchesParamsApi(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    // Build query string for API call
    const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    // Fetch matches from the API
    const apiResponse = await matchService.fetchData('apiOne', `v3/fixtures?${queryString}`);
    const matches = apiResponse.response;
    if (matches.length === 0) {
      return res.status(404).send('No matches found');
    }
    res.status(200).send(matches);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching matches');
  }
}

async function getMatchesFromDb(req, res) {
  try {
    const filters = req.query;
    const validation = matchService.validateMatchesParamsDb(filters);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    const matches = await matchService.getMatchesFromDb(filters);
    if (matches.length === 0) {
      return res.status(404).send('No matches found in the database');
    }
    res.status(200).send(matches);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching matches from the database');
  }
}

async function deleteMatchesFromDb(req, res) {
  try {
    const filters = req.query;
    const validation = matchService.validateMatchesParamsDb(filters);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    const result = await matchService.deleteMatchesFromDb(filters);
    if (result.affectedRows === 0) {
      return res.status(404).send('No matches found to delete');
    }
    res.status(200).send('Matches deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting matches from the database');
  }
}

async function updateMatchesInDb(req, res) {
  try {
    const params = req.query;
    const validation = matchService.validateMatchesParamsDb(params);
    if (!validation.valid) {
      return res.status(400).send(validation.message);
    }
    const { match_id, match_api_id, ... updateFields} = params;
    if(!match_id && !match_api_id) {
      return res.status(400).send('Missing identifier for update');
    }
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).send('No fields provided for update');
    }

    const result = await matchService.updateMatchesInDb({ match_id, match_api_id }, updateFields);
    if (result.affectedRows === 0) {
      return res.status(404).send('No matches found to update');
    }
    res.status(200).send('Matches updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating matches in the database');
  }
}

module.exports = { 
  importMatches,
  searchMatches,
  getMatchesFromDb,
  deleteMatchesFromDb,
  updateMatchesInDb
};
