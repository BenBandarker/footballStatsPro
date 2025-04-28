const { executeQuery } = require('../services/databaseService');

async function insertTeamStats(params) {
    const insertQuery = `
        INSERT INTO Team_Match_Stats
        (match_id, team_id, shots_on_goal, shots_off_goal, total_shots, blocked_shots, shots_insidebox, shots_outsidebox, fouls, corner_kicks, offsides, ball_possession, yellow_cards, red_cards, goalkeeper_saves, total_passes, passes_accurate, pass_accuracy)
        VALUES (?,?,?,?<?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    return await executeQuery(insertQuery, params);
}

async function deleteTeamStats(params) {
    const queryConditions = [];
    const queryParams = [];

    for (const [key, value] of Object.entries(params)) {
        queryConditions.push(`${key} = ?`);
        queryParams.push(decodeURIComponent(value));
    }

    if (queryConditions.length === 0) {
        throw new Error('No parameters provided for deletion');
    }

    const deleteQuery = `
        DELETE FROM Team_Match_Stats 
        WHERE ${queryConditions.join(' AND ')}`;
    return await executeQuery(deleteQuery, queryParams);
}

async function updateTeamStats(identifiers, updateFields) {
    const setClauses = [];
    const values = [];

    for (const [key, value] of Object.entries(updateFields)) {
        setClauses.push(`${key} = ?`);
        values.push(decodeURIComponent(value));
    }

    if ( !identifiers.stat_id && 
        (!identifiers.match_id || !identifiers.team_id) ) {
        throw new Error('You must provide either performance_id or both player_id and match_id.');
    }

    const whereClauses = [];
    if (identifiers.stat_id) {
        whereClauses.push('stat_id = ?');
        values.push(identifiers.stat_id);
    }
    if (identifiers.match_id) {
        whereClauses.push('match_id = ?');
        values.push(identifiers.match_id);
    }
    if (identifiers.team_id) {
        whereClauses.push('team_id = ?');
        values.push(identifiers.team_id);
    }

    const updateQuery = `
        UPDATE Team_Match_Stats
        SET ${setClauses.join(', ')}
        WHERE ${whereClauses.join(' AND ')}
    `;

    return await executeQuery(updateQuery, values);
}

async function findTeamStatsByFilters(filters) {
    const queryBase = `
        SELECT * FROM Team_Match_Stats`;
    const queryConditions = [];
    const queryParams = [];

    for (const [key, value] of Object.entries(filters)) {
        queryConditions.push(`${key} = ?`);
        queryParams.push(decodeURIComponent(value));
    }

    const query = queryConditions.length > 0 ? `${queryBase} WHERE ${queryConditions.join(' AND ')}` : queryBase;

    return await executeQuery(query, queryParams);
}

// TODO
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

module.exports = {
    insertTeamStats,
    deleteTeamStats,
    updateTeamStats,
    findTeamStatsByFilters,
    getTeamStats
};