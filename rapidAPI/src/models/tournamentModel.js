const { executeQuery } = require('../services/databaseService');

async function insertTournament(params) {
    const insertQuery = `
        INSERT INTO Tournaments 
        (tournament_api_id, tournament_name, start_date, end_date, location, logo_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    return await executeQuery(insertQuery, params);
}

async function deleteTournaments(filters) {
    const queryConditions = [];
    const queryParams = [];

    for (const [key, value] of Object.entries(filters)) {
        queryConditions.push(`${key} = ?`);
        queryParams.push(decodeURIComponent(value));
    }

    if (queryConditions.length === 0) {
        throw new Error('No parameters provided for deletion');
    }

    const deleteQuery = `DELETE FROM Tournaments WHERE ${queryConditions.join(' AND ')}`;
    return await executeQuery(deleteQuery, queryParams);
}

async function updateTournaments(identifiers, updateFields) {
    const setClauses = [];
    const values = [];

    for (const [key, value] of Object.entries(updateFields)) {
        setClauses.push(`${key} = ?`);
        values.push(decodeURIComponent(value));
    }

    const whereClauses = [];
    if (identifiers.tournament_id) {
        whereClauses.push('tournament_id = ?');
        values.push(identifiers.tournament_id);
    }
    if (identifiers.tournament_api_id) {
        whereClauses.push('tournament_api_id = ?');
        values.push(identifiers.tournament_api_id);
    }

    if (whereClauses.length === 0) {
        throw new Error('Missing identifier for update');
    }

    const updateQuery = `
        UPDATE Tournaments
        SET ${setClauses.join(', ')}
        WHERE ${whereClauses.join(' AND ')}
    `;

    return await executeQuery(updateQuery, values);
}

async function findTournamentsByFilters(filters) {
    const queryBase = 'SELECT * FROM Tournaments';
    const queryConditions = [];
    const queryParams = [];

    for (const [key, value] of Object.entries(filters)) {
        queryConditions.push(`${key} = ?`);
        queryParams.push(decodeURIComponent(value));
    }

    const query = queryConditions.length > 0
        ? `${queryBase} WHERE ${queryConditions.join(' AND ')}`
        : queryBase;

    return await executeQuery(query, queryParams);
}

module.exports = {
    insertTournament,
    findTournamentsByFilters,
    deleteTournaments,
    updateTournaments
  };