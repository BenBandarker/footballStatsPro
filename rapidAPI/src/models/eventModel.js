const { executeQuery } = require('../services/databaseService');

async function insertEvent(params) { 
    const insertQuery = `
        INSERT INTO Team_Events (
            match_id, team_id, player_id, assist_id, event_type, event_time, event_extra
        ) 
        VALUES (
            ?, ?, ?, ?, ?, ?, ?
        )
    `;
    return await executeQuery(insertQuery, params);
}

async function deleteEvent(params) {
    const queryConditions = [];
    const queryParams = [];

    for (const [key, value] of Object.entries(params)) {
        queryConditions.push(`${key} = ?`);
        queryParams.push(decodeURIComponent(value));
    }

    if (queryConditions.length === 0) {
        throw new Error('No parameters provided for deletion');
    }

    const deleteQuery = `DELETE FROM Team_Events WHERE ${queryConditions.join(' AND ')}`;
    return await executeQuery(deleteQuery, queryParams);
}

async function updateEvent(identifiers, updateFields) {
    const setClauses = [];
    const values = [];

    for (const [key, value] of Object.entries(updateFields)) {
        setClauses.push(`${key} = ?`);
        values.push(decodeURIComponent(value));
    }

    if ( !identifiers.event_id  ){
        throw new Error('You must provide either event_id.');
    }

    const whereClauses = [];
    if (identifiers.event_id) {
        whereClauses.push('event_id = ?');
        values.push(identifiers.event_id);
    }

    const updateQuery = `
        UPDATE Team_Events
        SET ${setClauses.join(', ')}
        WHERE ${whereClauses.join(' AND ')}
    `;

    return await executeQuery(updateQuery, values);
}

async function findEventByFilters(filters) {
    const queryBase = `SELECT * FROM Team_Events`;
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

async function getTeamEventsStatistics({ groupBy, aggregates }) {
    if (!groupBy || !aggregates || aggregates.length === 0) {
        throw new Error('Missing groupBy or aggregates parameters');
    }

    const selectFields = aggregates.map(agg => {
        const [func, field] = agg.split(':');
        return `${func.toUpperCase()}(${field}) AS ${func.toLowerCase()}_${field}`;
    });

    const query = `
        SELECT ${groupBy}, ${selectFields.join(', ')}
        FROM Team_Events
        GROUP BY ${groupBy}
    `;

    return await executeQuery(query);
}
  

module.exports = {
    insertEvent,
    deleteEvent,
    updateEvent,
    findEventByFilters,
    getTeamEventsStatistics,
};