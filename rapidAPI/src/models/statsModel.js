const { executeQuery } = require('../services/databaseService');

async function insertTeamStats(params) {
    const queryConditions = [];
    const queryParams = [];

    for (const [key, value] of Object.entries(filters)) {
        queryConditions.push(`${key} = ?`);
        queryParams.push(decodeURIComponent(value));
    }

    if (queryConditions.length === 0) {
        throw new Error('No parameters provided for search');
    }

    const selectQuery = `SELECT * FROM Matches WHERE ${queryConditions.join(' AND ')}`;
    return await executeQuery(selectQuery, queryParams);
}

async function deleteTeamStats(params) {
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

async function updateTeamStats(identifiers, updateFields) {
    const setClauses = [];
    const values = [];

    for (const [key, value] of Object.entries(updateFields)) {
        setClauses.push(`${key} = ?`);
        values.push(decodeURIComponent(value));
    }

    const whereClauses = [];
    if (identifiers.team_id) {
        whereClauses.push('team_id = ?');
        values.push(identifiers.team_id);
    }
    if (identifiers.team_api_id) {
        whereClauses.push('team_api_id = ?');
        values.push(identifiers.team_api_id);
    }

    if (whereClauses.length === 0) {
        throw new Error('Missing identifier for update');
    }

    const updateQuery = `
        UPDATE Teams
        SET ${setClauses.join(', ')}
        WHERE ${whereClauses.join(' AND ')}
    `;

    return await executeQuery(updateQuery, values);
}

async function findTeamStatsByFilters(filters) {
    const queryBase = `SELECT * FROM Teams`;
    const queryConditions = [];
    const queryParams = [];

    for (const [key, value] of Object.entries(filters)) {
        queryConditions.push(`${key} = ?`);
        queryParams.push(decodeURIComponent(value));
    }

    if (queryConditions.length === 0) {
        throw new Error('No parameters provided for search');
    }

    const selectQuery = `${queryBase} WHERE ${queryConditions.join(' AND ')}`;
    return await executeQuery(selectQuery, queryParams);
}


async function insertPlayerStats(params) { 
    const insertQuery = `INSERT INTO Players (player_id, player_api_id, player_name, player_age, player_height, player_weight) VALUES (?, ?, ?, ?, ?, ?)`;
    return await executeQuery(insertQuery, params);
}

async function deletePlayerStats(params) {
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

async function updatePlayerStats(identifiers, updateFields) {
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

async function findPlayerStatsByFilters(filters) {
    const queryBase = `SELECT * FROM Players`;
    const queryConditions = [];
    const queryParams = [];

    for (const [key, value] of Object.entries(filters)) {
        queryConditions.push(`${key} = ?`);
        queryParams.push(decodeURIComponent(value));
    }

    if (queryConditions.length === 0) {
        throw new Error('No parameters provided for search');
    }

    const selectQuery = `${queryBase} WHERE ${queryConditions.join(' AND ')}`;
    return await executeQuery(selectQuery, queryParams);
}

async function getPlayerStats(params) { // שאילתות לסטטיסטיקות שחקן
    const queryConditions = [];
    const queryParams = [];

    for (const [key, value] of Object.entries(filters)) {
        queryConditions.push(`${key} = ?`);
        queryParams.push(decodeURIComponent(value));
    }

    if (queryConditions.length === 0) {
        throw new Error('No parameters provided for search');
    }

    const selectQuery = `SELECT SUM(*) FROM Players WHERE ${queryConditions.join(' AND ')}`;
    return await executeQuery(selectQuery, queryParams);
}

async function getTeamStats(params) { // שאילתות לסטטיסטיקות קבוצה
    const queryConditions = [];
    const queryParams = [];

    for (const [key, value] of Object.entries(filters)) {
        queryConditions.push(`${key} = ?`);
        queryParams.push(decodeURIComponent(value));
    }

    if (queryConditions.length === 0) {
        throw new Error('No parameters provided for search');
    }

    const selectQuery = `SELECT SUM(*) FROM Teams WHERE ${queryConditions.join(' AND ')}`;
    return await executeQuery(selectQuery, queryParams);
}