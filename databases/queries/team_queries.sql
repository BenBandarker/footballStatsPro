-- team_queries.sql

-- Insert a new team
-- Arguments:
INSERT INTO Teams (team_api_id, team_name,country, founded_year, stadium_name) 
    VALUES (?, ?, ?, ?, ?);

-- Insert team match stats
-- Arguments: {match_id}, {team_id}, {possession_percent}, {shots}, {expected_goals}, {passes}, {tackles}, {tackles_won}, {fouls_committed}, {offsides}, {corners}, {free_kicks}, {penalty_kicks}, {yellow_cards}, {red_cards}
INSERT INTO Team_Match_Stats (
    match_id, team_id, possession_percent, shots, expected_goals, passes, tackles, tackles_won, fouls_committed, offsides, corners, free_kicks, penalty_kicks, yellow_cards, red_cards) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- Retrieve team performance in a specific match
-- Arguments: {team_id}, {match_id}
SELECT * 
FROM Team_Match_Stats 
WHERE team_id = ? AND match_id = ?;

-- Retrieve teams ranked by possession percentage
-- Arguments: {limit}
SELECT t.team_name, ts.possession_percent
FROM Team_Match_Stats ts
JOIN Teams t ON ts.team_id = t.team_id
ORDER BY ts.possession_percent DESC
LIMIT ?;

-- Retrieve teams ranked by goals scored in a tournament
-- Arguments: {tournament_id}, {limit}
SELECT t.team_name, SUM(m.home_team_score + m.away_team_score) AS total_goals
FROM Matches m
JOIN Teams t ON m.home_team_id = t.team_id OR m.away_team_id = t.team_id
WHERE m.tournament_id = ?
GROUP BY t.team_id
ORDER BY total_goals DESC
LIMIT ?;

-- Update team match stats
-- Arguments: {stat_id}, {possession_percent}, {shots}, {expected_goals}, {passes}, {tackles}, {tackles_won}, {fouls_committed}, {offsides}, {corners}, {free_kicks}, {penalty_kicks}, {yellow_cards}, {red_cards}
UPDATE Team_Match_Stats
SET possession_percent = ?, shots = ?, expected_goals = ?, passes = ?, tackles = ?, tackles_won = ?, fouls_committed = ?, offsides = ?, corners = ?, free_kicks = ?, penalty_kicks = ?, yellow_cards = ?, red_cards = ?
WHERE stat_id = ?;


-- Query to get all teams in a specific tournament
SELECT DISTINCT t.team_name
FROM Matches m
JOIN Teams t ON m.home_team_id = t.team_id OR m.away_team_id = t.team_id
WHERE m.tournament_id = 1;

-- Query to calculate total wins, losses, and draws for a team
SELECT t.team_name,
       SUM(CASE WHEN (m.home_team_id = t.team_id AND m.home_team_score > m.away_team_score) 
                 OR (m.away_team_id = t.team_id AND m.away_team_score > m.home_team_score) THEN 1 ELSE 0 END) AS wins,
       SUM(CASE WHEN (m.home_team_id = t.team_id AND m.home_team_score < m.away_team_score) 
                 OR (m.away_team_id = t.team_id AND m.away_team_score < m.home_team_score) THEN 1 ELSE 0 END) AS losses,
       SUM(CASE WHEN m.home_team_score = m.away_team_score THEN 1 ELSE 0 END) AS draws
FROM Teams t
LEFT JOIN Matches m ON t.team_id = m.home_team_id OR t.team_id = m.away_team_id
GROUP BY t.team_name;