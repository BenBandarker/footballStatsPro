const eventService = require('../services/eventService');

async function importEvent(req, res) {
  try {
    const params = req.query;

    // Fetch players stats from the API
    const matchEvents = await eventService.getEventsFromApi(params);
    if (matchEvents.length === 0) {
      return res.status(404).send('No players stats found');
    }
    // Save players stats to the database
    for (const event of matchEvents) {
      try {
        await eventService.saveEventToDatabase(params.fixture, event);
      } catch (error) {
        // Handle duplicate entry error and log the skipped player
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`Duplicate entry for (match_id, team_id, event_time, event_type) ${params.fixture} & ${event.team.id} & ${event.time.elapsed} & ${event.type}, skipping...`);
        } else {
          console.error(`Error saving player API-ID ${event.player.id}: ${error.message}`);
          throw error; 
        }
      
      }
    }

    res.status(201).send('Match events imported successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error importing Match events');
  }
}

async function getEventDb(req, res) {
  try {
    const filters = req.query;
    
    const matchEvents = await eventService.getEventFromDb(filters);
    if (matchEvents.length === 0) {
      return res.status(404).send('No Match events found in the database');
    }
    res.status(200).send(matchEvents);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching Match events from the database');
  }
}

async function deleteEventFromDb(req, res) {
  try {
    const filters = req.query;
    
    const result = await eventService.deleteEvent(filters);
    if (result.affectedRows === 0) {
      return res.status(404).send('No Match events found to delete');
    }
    res.status(200).send('Match events deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting Match events from the database');
  }
}

async function updateEventDb(req, res) {
  try {
    const params = req.query;
    
    const { event_id, ...updateFields } = params;
    if ( !event_id ) {
      return res.status(400).send('Missing event_id for WHERE clause');
    }
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).send('No fields provided for update');
    }
    const result = await eventService.updateEvent({ event_id } , updateFields);
    if (result.affectedRows === 0) {
      return res.status(404).send('No Match events found to update');
    }
    res.status(200).send('Match events updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating Match events in the database');
  }
}

async function getTeamEventsStatistics(req, res) {
  try {
    const { groupBy, aggregates } = req.query;

    if (!groupBy || !aggregates) {
      return res.status(400).send('Missing groupBy or aggregates parameters');
    }

    const aggregatesArray = aggregates.split(',');

    const results = await teamEventsService.getTeamEventsStatistics({ groupBy, aggregates: aggregatesArray });

    if (results.length === 0) {
      return res.status(404).send('No statistics found');
    }

    res.status(200).send(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching team events statistics');
  }
}


module.exports = {
  importEvent,
  getEventDb,
  deleteEventFromDb,
  updateEventDb,
  getTeamEventsStatistics,
};