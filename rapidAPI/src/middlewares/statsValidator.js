
async function validateTopStatParamApi(params) {
  const currentYear = new Date().getFullYear();
  if(!params.league || !params.season) {
    return { valid: false, message: 'Missing required parameters: league and season' };
  }
  for (const [key, value] of Object.entries(params)) {
    switch(key) {
      case 'league':
        league_value = parseInt(value);
        if (!value || typeof league_value !== 'number') {
          return { valid: false, message: 'Invalid league parameter' };
        }
        break;
      case 'season':
        num_value = parseInt(value);
        if (!num_value || typeof num_value !== 'number' || num_value < 2010 || num_value > currentYear) {
          return { valid: false, message: 'Invalid season parameter. Make sure the season is between 2010 and the current year.' };
        }
        break;
      default:
        return { valid: false, message: `Unknown parameter: ${key}` };
    }
  }
  return { valid: true };
}

function validateTopStatsAPI(req, res, next) {
  const validation = validateTopStatParamApi(req.query);
  if (!validation.valid) {
    return res.status(400).send(validation.message);
  }
  next();
}


async function validateTeamStatsParamsApi(params) { 
  if(!params.fixture || !params.team) {
    return { valid: false, message: 'Missing required parameters: fixture and team' };
  }
  
  for (const [key, value] of Object.entries(params)) {
    switch(key) {
      case 'fixture':
        fix_value = parseInt(value);
        if (!value || typeof fix_value !== 'number') {
          return { valid: false, message: 'Invalid fixture parameter' };
        }
        break;
      case 'team':
        team_value = parseInt(value);
        if (!value || typeof team_value !== 'number') {
          return { valid: false, message: 'Invalid team parameter' };
        }
        break;
      default:
        return { valid: false, message: `Unknown parameter: ${key}` };
    }
  }
  return { valid: true };
}

function validateTeamStatsAPI(req, res, next) {
  const validation = validateTeamStatsParamsApi(req.query);
  if (!validation.valid) {
    return res.status(400).send(validation.message);
  }
  next();
}

async function validateTeamMatchStatsParamsDb(params) {
  for (const [key, value] of Object.entries(params)) {
    switch (key) {
      case 'stat_id':
      case 'match_id':
      case 'team_id':
      case 'shots_on_goal':
      case 'shots_off_goal':
      case 'total_shots':
      case 'blocked_shots':
      case 'shots_insidebox':
      case 'shots_outsidebox':
      case 'fouls':
      case 'corner_kicks':
      case 'offsides':
      case 'yellow_cards':
      case 'red_cards':
      case 'goalkeeper_saves':
      case 'total_passes':
      case 'passes_accurate':
        if (value === undefined || isNaN(parseInt(value))) {
          return { valid: false, message: `Invalid or missing integer for ${key}` };
        }
        break;

      case 'ball_possession':
      case 'pass_accuracy':
        if (value === undefined || isNaN(parseFloat(value))) {
          return { valid: false, message: `Invalid decimal value for ${key}` };
        }
        break;

      default:
        return { valid: false, message: `Unknown or invalid parameter: ${key}` };
    }
  }

  return { valid: true };
}

function validateTeamMatchStatsDb(req, res, next) {
  const validation = validateTeamMatchStatsParamsDb(req.query);
  if (!validation.valid) {
    return res.status(400).send(validation.message);
  }
  next();
}

async function validatePlayerPerfParamApi(params) {
  if(!params.fixture || !params.team) {
    return { valid: false, message: 'Missing required parameters: fixture and team' };
  }
  
  for (const [key, value] of Object.entries(params)) {
    switch(key) {
      case 'fixture':
        fix_value = parseInt(value);
        if (!value || typeof fix_value !== 'number') {
          return { valid: false, message: 'Invalid fixture parameter' };
        }
        break;
      case 'team':
        team_value = parseInt(value);
        if (!value || typeof team_value !== 'number') {
          return { valid: false, message: 'Invalid team parameter' };
        }
        break;
      default:
        return { valid: false, message: `Unknown parameter: ${key}` };
    }
  }
  return { valid: true };
}

function validatePlayerPerfAPI(req, res, next) {
  const validation = validatePlayerPerfParamApi(req.query);
  if (!validation.valid) {
    return res.status(400).send(validation.message);
  }
  next();
}

async function validatePlayerPerformanceParamsDb(params) {
  const enumPositions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

  for (const [key, value] of Object.entries(params)) {
    switch (key) {
      case 'performance_id':
      case 'player_id':
      case 'match_id':
      case 'minutes_played':
      case 'offsides':
      case 'total_shots':
      case 'shots_on_target':
      case 'goals':
      case 'conceded_goals':
      case 'assists':
      case 'saves':
      case 'total_passes':
      case 'key_passes':
      case 'total_tackles':
      case 'blocks':
      case 'interceptions':
      case 'total_duels':
      case 'duels_won':
      case 'dribbles_attempted':
      case 'dribbles_completed':
      case 'dribble_pasts':
      case 'fouls_drawn':
      case 'fouls_committed':
      case 'yellow_cards':
      case 'red_cards':
      case 'penalty_won':
      case 'penalty_committed':
      case 'penalty_scored':
      case 'penalty_missed':
      case 'penalty_saved':
        if (value === undefined || isNaN(parseInt(value))) {
          return { valid: false, message: `Invalid or missing integer for ${key}` };
        }
        break;

      case 'position':
        if (!enumPositions.includes(value)) {
          return { valid: false, message: `Invalid position value: ${value}` };
        }
        break;

      case 'rating':
      case 'pass_accuracy':
        if (value === undefined || isNaN(parseFloat(value))) {
          return { valid: false, message: `Invalid decimal value for ${key}` };
        }
        break;

      case 'captain':
      case 'substitute':
        if (typeof value !== 'boolean' && value !== 0 && value !== 1) {
          return { valid: false, message: `Invalid boolean value for ${key}` };
        }
        break;

      default:
        return { valid: false, message: `Unknown or invalid parameter: ${key}` };
    }
  }

  return { valid: true };
}

function validatePlayerPerformanceDb(req, res, next) {
  const validation = validatePlayerPerformanceParamsDb(req.query);
  if (!validation.valid) {
    return res.status(400).send(validation.message);
  }
  next();
}

async function validateEventParamApi(params) {
  if(!params.fixture ) {
    return { valid: false, message: 'Missing required parameters: fixture' };
  }
  
  for (const [key, value] of Object.entries(params)) {
    switch(key) {
      case 'fixture':
        fix_value = parseInt(value);
        if (!value || typeof fix_value !== 'number') {
          return { valid: false, message: 'Invalid fixture parameter' };
        }
        break;
      case 'team':
        team_value = parseInt(value);
        if (!value || typeof team_value !== 'number') {
          return { valid: false, message: 'Invalid team parameter' };
        }
        break;
      case 'player':
        player_value = parseInt(value);
        if (!value || typeof player_value !== 'number') {
          return { valid: false, message: 'Invalid player parameter' };
        }
        break;
      default:
        return { valid: false, message: `Unknown parameter: ${key}` };
    }
  }
  return { valid: true };
}

function validateEventAPI(req, res, next) {
  const validation = validateEventParamApi(req.query);
  if (!validation.valid) {
    return res.status(400).send(validation.message);
  }
  next();
}

async function validateEventsParamsDb(params) {
  const enumEventTypes = ['Goal', 'Corner', 'Offside', 'Foul', 'Penalty'];

  for (const [key, value] of Object.entries(params)) {
    switch (key) {
      case 'event_id':
      case 'match_id':
      case 'team_id':
      case 'player_id':
      case 'assist_id':
      case 'event_time':
      case 'event_extra':
        if (isNaN(parseInt(value))) {
          return { valid: false, message: `Invalid or missing integer for ${key}` };
        }
        break;

      case 'event_type':
        if (!enumEventTypes.includes(value)) {
          return { valid: false, message: `Invalid event_type value: ${value}` };
        }
        break;

      default:
        return { valid: false, message: `Unknown or invalid parameter: ${key}` };
    }
  }

  return { valid: true };
}

function validateEventsDb(req, res, next) {
  const validation = validateEventsParamsDb(req.query);
  if (!validation.valid) {
    return res.status(400).send(validation.message);
  }
  next();
}

function validatePlayerStatisticsParams(req, res, next) {
  const allowedFields = [
    'performance_id', 'player_id', 'match_id', 'minutes_played', 'rating', 'offsides', 'total_shots',
    'shots_on_target', 'goals', 'conceded_goals', 'assists', 'saves', 'total_passes', 'key_passes',
    'pass_accuracy', 'total_tackles', 'blocks', 'interceptions', 'total_duels', 'duels_won',
    'dribbles_attempted', 'dribbles_completed', 'dribble_pasts', 'fouls_drawn', 'fouls_committed',
    'yellow_cards', 'red_cards', 'penalty_won', 'penalty_committed', 'penalty_scored', 'penalty_missed', 'penalty_saved'
  ];

  const { groupBy, aggregates } = req.query;

  if (!groupBy || !allowedFields.includes(groupBy)) {
    return res.status(400).send('Invalid or missing groupBy field.');
  }

  if (!aggregates) {
    return res.status(400).send('Missing aggregates.');
  }

  const aggregateItems = aggregates.split(',');

  for (const item of aggregateItems) {
    const [func, field] = item.split('_');
    if (!['sum', 'avg', 'count'].includes(func.toLowerCase())) {
      return res.status(400).send(`Invalid aggregate function: ${func}`);
    }
    if (!allowedFields.includes(field)) {
      return res.status(400).send(`Invalid aggregate field: ${field}`);
    }
  }

  next();
}

function validateTeamMatchStatisticsParams(req, res, next) {
  const allowedFields = [
    'stat_id', 'match_id', 'team_id', 'shots_on_goal', 'shots_off_goal', 'total_shots', 'blocked_shots',
    'shots_insidebox', 'shots_outsidebox', 'fouls', 'corner_kicks', 'offsides', 'ball_possession',
    'yellow_cards', 'red_cards', 'goalkeeper_saves', 'total_passes', 'passes_accurate', 'pass_accuracy'
  ];

  const { groupBy, aggregates } = req.query;

  if (!groupBy || !allowedFields.includes(groupBy)) {
    return res.status(400).send('Invalid or missing groupBy field.');
  }

  if (!aggregates) {
    return res.status(400).send('Missing aggregates.');
  }

  const aggregateItems = aggregates.split(',');

  for (const item of aggregateItems) {
    const [func, field] = item.split('_');
    if (!['sum', 'avg', 'count'].includes(func.toLowerCase())) {
      return res.status(400).send(`Invalid aggregate function: ${func}`);
    }
    if (!allowedFields.includes(field)) {
      return res.status(400).send(`Invalid aggregate field: ${field}`);
    }
  }

  next();
}

function validateEventStatisticsParams(req, res, next) {
  const allowedFields = [
    'event_id', 'match_id', 'team_id', 'player_id', 'assist_id', 'event_time', 'event_extra'
  ];

  const { groupBy, aggregates } = req.query;

  if (!groupBy || !allowedFields.includes(groupBy)) {
    return res.status(400).send('Invalid or missing groupBy field.');
  }

  if (!aggregates) {
    return res.status(400).send('Missing aggregates.');
  }

  const aggregateItems = aggregates.split(',');

  for (const item of aggregateItems) {
    const [func, field] = item.split('_');
    if (!['sum', 'avg', 'count'].includes(func.toLowerCase())) {
      return res.status(400).send(`Invalid aggregate function: ${func}`);
    }
    if (!allowedFields.includes(field)) {
      return res.status(400).send(`Invalid aggregate field: ${field}`);
    }
  }

  next();
}


module.exports = {
  validateTopStatsAPI,
  validateTeamStatsAPI,
  validatePlayerPerfAPI,
  validateTeamMatchStatsDb,
  validatePlayerPerformanceDb,
  validateEventAPI,
  validateEventsDb,
  validatePlayerStatisticsParams,
  validateTeamMatchStatisticsParams,
  validateEventStatisticsParams,
};