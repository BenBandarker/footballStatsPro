-- team_queries.sql

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
