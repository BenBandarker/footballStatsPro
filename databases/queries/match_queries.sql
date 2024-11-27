-- match_queries.sql

-- Query to get match results for a specific tournament
SELECT m.match_date, ht.team_name AS home_team, at.team_name AS away_team,
       m.home_team_score, m.away_team_score, m.match_status
FROM Matches m
JOIN Teams ht ON m.home_team_id = ht.team_id
JOIN Teams at ON m.away_team_id = at.team_id
WHERE m.tournament_id = 1;

-- Query to list all scheduled matches for a specific team
SELECT m.match_date, m.match_time, ht.team_name AS home_team, at.team_name AS away_team
FROM Matches m
JOIN Teams ht ON m.home_team_id = ht.team_id
JOIN Teams at ON m.away_team_id = at.team_id
WHERE (m.home_team_id = 3 OR m.away_team_id = 3)
  AND m.match_status = 'Scheduled';
