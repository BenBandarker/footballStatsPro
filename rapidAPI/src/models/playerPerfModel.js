const { executeQuery } = require('../services/databaseService');


async function insertPlayerPerformance(params) { 
    const insertQuery = `
        INSERT INTO Player_Performance (
            player_id, match_id, minutes_played, position, rating, captain, substitute,
            offsides, total_shots, shots_on_target, goals, conceded_goals, assists, saves,
            total_passes, key_passes, pass_accuracy, total_tackles, blocks, interceptions,
            total_duels, duels_won, dribbles_attempted, dribbles_completed, dribble_pasts,
            fouls_drawn, fouls_committed, yellow_cards, red_cards,
            penalty_won, penalty_committed, penalty_scored, penalty_missed, penalty_saved
        ) 
        VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
    `;
    return await executeQuery(insertQuery, params);
}

async function deletePlayerPerformance(params) {
    const queryConditions = [];
    const queryParams = [];

    for (const [key, value] of Object.entries(params)) {
        queryConditions.push(`${key} = ?`);
        queryParams.push(decodeURIComponent(value));
    }

    if (queryConditions.length === 0) {
        throw new Error('No parameters provided for deletion');
    }

    const deleteQuery = `DELETE FROM Player_Performance WHERE ${queryConditions.join(' AND ')}`;
    return await executeQuery(deleteQuery, queryParams);
}

async function updatePlayerPerformance(identifiers, updateFields) {
    const setClauses = [];
    const values = [];

    for (const [key, value] of Object.entries(updateFields)) {
        setClauses.push(`${key} = ?`);
        values.push(decodeURIComponent(value));
    }

    if ( !identifiers.performance_id && 
        (!identifiers.player_id || !identifiers.match_id) ) {
        throw new Error('You must provide either performance_id or both player_id and match_id.');
    }

    const whereClauses = [];
    if (identifiers.performance_id) {
        whereClauses.push('performance_id = ?');
        values.push(identifiers.performance_id);
    }
    if (identifiers.player_id) {
        whereClauses.push('player_id = ?');
        values.push(identifiers.player_id);
    }
    if (identifiers.match_id) {
        whereClauses.push('match_id = ?');
        values.push(identifiers.match_id);
    }

    const updateQuery = `
        UPDATE Player_Performance
        SET ${setClauses.join(', ')}
        WHERE ${whereClauses.join(' AND ')}
    `;

    return await executeQuery(updateQuery, values);
}

async function findPlayerPerformanceByFilters(filters) {
    const queryBase = `SELECT * FROM Player_Performance`;
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

// TODO
async function getPlayerStats(params) { // שאילתות לסטטיסטיקות שחקן
    const queryConditions = [];
    const queryParams = [];

    for (const [key, value] of Object.entries(params)) {
        queryConditions.push(`${key} = ?`);
        queryParams.push(decodeURIComponent(value));
    }

    if (queryConditions.length === 0) {
        throw new Error('No parameters provided for search');
    }

    const selectQuery = `SELECT SUM(*) FROM Players WHERE ${queryConditions.join(' AND ')}`;
    return await executeQuery(selectQuery, queryParams);
}

module.exports = {
    insertPlayerPerformance,
    deletePlayerPerformance,
    updatePlayerPerformance,
    findPlayerPerformanceByFilters,
    getPlayerStats,
};