-- player_queries.sql

-- Query to get all players in a specific team
SELECT player_name, position, nationality, date_of_birth
FROM Players
WHERE team_id = ?;

-- Retrieve all players
SELECT * FROM Players;

-- Retrieve a player by ID
-- Arguments: {player_id}
SELECT * 
FROM Players 
WHERE player_id = ?;

-- Search players by name (partial match)
-- Arguments: {player_name_pattern}
SELECT * 
FROM Players 
WHERE player_name LIKE ?;

-- Retrieve players in a specific team
-- Arguments: {team_id}
SELECT player_id, player_name, position, nationality 
FROM Players 
WHERE team_id = ?;

-- Retrieve players who scored goals in a specific match
-- Arguments: {match_id}
SELECT p.player_id, p.player_name, ps.goals 
FROM Players p
JOIN Players_Stats ps ON p.player_id = ps.player_id
WHERE ps.match_id = ? AND ps.goals > 0;

-- Update a player's team
-- Arguments: {player_id}, {new_team_id}
UPDATE Players 
SET team_id = ? 
WHERE player_id = ?;

-- Update a player's position
-- Arguments: {player_id}, {new_position}
UPDATE Players 
SET position = ? 
WHERE player_id = ?;

-- Delete a player by ID
-- Arguments: {player_id}
DELETE FROM Players 
WHERE player_id = ?;

-- Retrieve all players with their team names
SELECT p.player_id, p.player_name, p.position, t.team_name 
FROM Players p
JOIN Teams t ON p.team_id = t.team_id;

-- Retrieve players' performance statistics across all matches
SELECT p.player_name, m.match_date, ps.minutes_played, ps.goals, ps.assists 
FROM Players p
JOIN Players_Stats ps ON p.player_id = ps.player_id
JOIN Matches m ON ps.match_id = m.match_id
ORDER BY m.match_date DESC;

-- Retrieve the top N goal scorers
-- Arguments: {limit}
SELECT p.player_name, SUM(ps.goals) AS total_goals 
FROM Players p
JOIN Players_Stats ps ON p.player_id = ps.player_id
GROUP BY p.player_id
ORDER BY total_goals DESC
LIMIT ?;


------------------
-- Insert a new player
-- Arguments: {player_name}, {team_id}, {date_of_birth}, {position}, {nationality}
INSERT INTO Players (player_name, team_id, date_of_birth, position, nationality)
VALUES (?, ?, ?, ?, ?);

-- Insert player performance stats
-- Arguments: {player_id}, {match_id}, {minutes_played}, {distance_covered}, {distance_sprinted}, {goals}, {assists}, {shots}, {shot_accuracy}, {passes}, {pass_accuracy}, {tackles}, {tackles_won}, {fouls_committed}, {possession_won}, {possession_lost}, {dribbles}, {dribbles_completed}, {dribble_success_rate}, {match_rating}, {player_of_the_match}
INSERT INTO Player_Performance (
    player_id, match_id, minutes_played, distance_covered, distance_sprinted, goals, assists, 
    shots, shot_accuracy, passes, pass_accuracy, tackles, tackles_won, fouls_committed, possession_won, possession_lost, dribbles, dribbles_completed, dribble_success_rate, match_rating, player_of_the_match) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- Retrieve all players in a team
-- Arguments: {team_id}
SELECT * 
FROM Players 
WHERE team_id = ?;

-- Retrieve player performance in a specific match
-- Arguments: {player_id}, {match_id}
SELECT * 
FROM Player_Performance 
WHERE player_id = ? AND match_id = ?;

-- Retrieve top-performing players in a tournament
-- Arguments: {tournament_id}, {limit}
SELECT p.player_name, pp.match_rating
FROM Player_Performance pp
JOIN Matches m ON pp.match_id = m.match_id
JOIN Players p ON pp.player_id = p.player_id
WHERE m.tournament_id = ?
ORDER BY pp.match_rating DESC
LIMIT ?;

-- Retrieve players with the most goals in a tournament
-- Arguments: {tournament_id}, {limit}
SELECT p.player_name, SUM(pp.goals) AS total_goals
FROM Player_Performance pp
JOIN Matches m ON pp.match_id = m.match_id
JOIN Players p ON pp.player_id = p.player_id
WHERE m.tournament_id = ?
GROUP BY pp.player_id
ORDER BY total_goals DESC
LIMIT ?;

-- Update player information
-- Arguments: {player_id}, {player_name}, {team_id}, {date_of_birth}, {position}, {nationality}
UPDATE Players
SET player_name = ?, team_id = ?, date_of_birth = ?, position = ?, nationality = ?
WHERE player_id = ?;

-- Update player performance stats
-- Arguments: {performance_id}, {minutes_played}, {distance_covered}, {distance_sprinted}, {goals}, {assists}, {shots}, {shot_accuracy}, {passes}, {pass_accuracy}, {tackles}, {tackles_won}, {fouls_committed}, {possession_won}, {possession_lost}, {dribbles}, {dribbles_completed}, {dribble_success_rate}, {match_rating}, {player_of_the_match}
UPDATE Player_Performance
SET minutes_played = ?, distance_covered = ?, distance_sprinted = ?, goals = ?, assists = ?, 
    shots = ?, shot_accuracy = ?, passes = ?, pass_accuracy = ?, tackles = ?, tackles_won = ?, 
    fouls_committed = ?, possession_won = ?, possession_lost = ?, dribbles = ?, dribbles_completed = ?, 
    dribble_success_rate = ?, match_rating = ?, player_of_the_match = ?
WHERE performance_id = ?;


