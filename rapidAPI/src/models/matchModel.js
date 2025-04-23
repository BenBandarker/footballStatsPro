const { executeQuery } = require('../services/databaseService');

async function insertMatch(params) {
    const insertQuery = `
        INSERT INTO Matches 
        (match_api_id, home_team_id, away_team_id, tournament_id, match_date, match_time, match_status, home_team_score, away_team_score)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    return await executeQuery(insertQuery, params);
}

async function deleteMatches(filters) {
    const queryConditions = [];
    const queryParams = [];

    for (const [key, value] of Object.entries(filters)) {
        queryConditions.push(`${key} = ?`);
        queryParams.push(decodeURIComponent(value));
    }

    if (queryConditions.length === 0) {
        throw new Error('No parameters provided for deletion');
    }

    const deleteQuery = `DELETE FROM Matches WHERE ${queryConditions.join(' AND ')}`;
    return await executeQuery(deleteQuery, queryParams);
}

async function updateMatches(identifiers, updateFields) {
    const setClauses = [];
    const values = [];

    for (const [key, value] of Object.entries(updateFields)) {
        setClauses.push(`${key} = ?`);
        values.push(decodeURIComponent(value));
    }

    const whereClauses = [];
    if (identifiers.match_id) {
        whereClauses.push('match_id = ?');
        values.push(identifiers.match_id);
    }
    if (identifiers.match_api_id) {
        whereClauses.push('match_api_id = ?');
        values.push(identifiers.match_api_id);
    }

    if (whereClauses.length === 0) {
        throw new Error('Missing identifier for update');
    }

    const updateQuery = `
        UPDATE Matches
        SET ${setClauses.join(', ')}
        WHERE ${whereClauses.join(' AND ')}
    `;

    return await executeQuery(updateQuery, values);
}

async function findMatchesByFilters(filters) {
    const queryBase = `SELECT * FROM Matches`;
    const queryConditions = [];
    const queryParams = [];
    
    for (const [key, value] of Object.entries(filters)) {
        queryConditions.push(`${key} = ?`);
        queryParams.push(decodeURIComponent(value));
    }
    
    const query = queryConditions.length > 0 ? `${queryBase} WHERE ${queryConditions.join(' AND ')}` : queryBase;
    return await executeQuery(query, queryParams);
}

module.exports = {
    insertMatch,
    deleteMatches,
    updateMatches,
    findMatchesByFilters
};