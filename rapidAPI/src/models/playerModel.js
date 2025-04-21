const { executeQuery } = require('../services/databaseService');

async function insertPlayer(params) {
    const insertQuery = `
        INSERT INTO Players 
        (player_api_id, player_Fname, player_Lname, date_of_birth, nationality, height, weight, photo_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    return await executeQuery(insertQuery, params);
    
}

async function deletePlayers(filters) {
    const queryConditions = [];
    const queryParams = [];

    for (const [key, value] of Object.entries(filters)) {
        queryConditions.push(`${key} = ?`);
        queryParams.push(decodeURIComponent(value));
    }

    if (queryConditions.length === 0) {
        throw new Error('No parameters provided for deletion');
    }

    const deleteQuery = `DELETE FROM Players WHERE ${queryConditions.join(' AND ')}`;
    return await executeQuery(deleteQuery, queryParams);
}

async function updatePlayers(identifiers, updateFields) {
    const setClauses = [];
    const values = [];

    for (const [key, value] of Object.entries(updateFields)) {
        setClauses.push(`${key} = ?`);
        values.push(decodeURIComponent(value));
    }

    const whereClauses = [];
    if (identifiers.player_id) {
        whereClauses.push('player_id = ?');
        values.push(identifiers.player_id);
    }
    if (identifiers.player_api_id) {
        whereClauses.push('player_api_id = ?');
        values.push(identifiers.player_api_id);
    }

    if (whereClauses.length === 0) {
        throw new Error('Missing identifier for update');
    }

    const updateQuery = `
        UPDATE Players
        SET ${setClauses.join(', ')}
        WHERE ${whereClauses.join(' AND ')}
    `;

    return await executeQuery(updateQuery, values);
}

async function findPlayersByFilters(filters) {
    const queryBase = `SELECT * FROM Players`;
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
    insertPlayer,
    deletePlayers,
    updatePlayers,
    findPlayersByFilters,
};