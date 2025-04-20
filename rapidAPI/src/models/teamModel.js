const { executeQuery } = require('../services/databaseService');

async function insertTeam(params){
    const insertQuery = `INSERT INTO Teams (team_api_id, team_name,country, founded_year, stadium_name) VALUES (?, ?, ?, ?, ?)`;

  return await executeQuery(insertQuery, params);
}

async function deleteTeams(filters) {
    const queryConditions = [];
    const queryParams = [];

    for (const [key, value] of Object.entries(params)) {
      queryConditions.push(`${key} = ?`);
      queryParams.push(decodeURIComponent(value)); // decodeURIComponent needed to handle values with spaces 
    }

    if(queryConditions.length === 0) {
        return res.status(400).send('No parameters provided for deletion');
    }

    const query = `DELETE FROM Teams WHERE ${queryConditions.join(' AND ')}`;
    return await executeQuery(query, queryParams);

}

async function updateTeams(identifiers, updateFields) {
    const setClauses = [];
    const values = [];
    for( const [key, value] of Object.entries(updateFields)) {
        setClauses.push(`${key} = ?`);
        values.push(decodeURIComponent(value)); // decodeURIComponent needed to handle values with spaces
    }

    const whereClauses = [];
    if(identifiers.team_id) {
        whereClauses.push('team_id = ?');
        values.push(identifiers.team_id);
    }
    if(identifiers.team_api_id){
        whereClauses.push('team_api_id = ?');
        values.push(identifiers.team_api_id);
    }

    if (whereClauses.length === 0) {
        throw new Error('Missing identifier for update');
    }

    const updateQuery = `
    UPDATE Teams
    SET ${setClauses.join(', ')}
    where ${whereClauses.join(' AND ')}
    `;
    return await executeQuery(updateQuery, values);
    
}

async function findTeamsByFilters(filters) {
    const queryBase = 'SELECT * FROM Teams';
    const queryConditions = [];
    const queryParams = [];

    // Build the WHERE clause dynamically
    for (const [key, value] of Object.entries(params)) {
      queryConditions.push(`${key} = ?`);                          
      queryParams.push(decodeURIComponent(value)); // decodeURIComponent needed to handle values with spaces
    }

    // Combine the base query with conditions if any
    const query = queryConditions.length > 0 ? `${queryBase} WHERE ${queryConditions.join(' AND ')}` : queryBase;

    return await executeQuery(query, queryParams);
}

module.exports = {
    insertTeam,
    findTeamsByFilters,
    deleteTeams,
    updateTeams
};
