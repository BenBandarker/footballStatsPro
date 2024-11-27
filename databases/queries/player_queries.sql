-- player_queries.sql

-- Query to get all players in a specific team
SELECT player_name, position, nationality, date_of_birth
FROM Players
WHERE team_id = 1;

-- Query to find players with more than 5 goals
SELECT p.player_name, SUM(ps.goals) AS total_goals, t.tournament_name
FROM Players_Stats ps
JOIN Players p ON ps.player_id = p.player_id
JOIN Matches m ON ps.match_id = m.match_id
JOIN Tournaments t ON m.tournament_id = t.tournament_id
WHERE t.tournament_name = 'World Cup' 
GROUP BY p.player_id, t.tournament_name
HAVING total_goals > 0;

-- Query to get players with yellow or red cards in a match
SELECT p.player_name, ps.yellow_cards, ps.red_cards
FROM Players_Stats ps
JOIN Players p ON ps.player_id = p.player_id
WHERE ps.match_id = 101 
AND (ps.yellow_cards > 0 OR ps.red_cards > 0);
