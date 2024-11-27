-- match_queries.sql
-- Insert a new match
-- Arguments: {home_team_id}, {away_team_id}, {tournament_id}, {match_date}, {match_time}, {match_status}, {home_team_score}, {away_team_score}
INSERT INTO Matches (
    home_team_id, away_team_id, tournament_id, match_date, match_time, match_status, home_team_score, away_team_score
) VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- Retrieve all matches in a tournament
-- Arguments: {tournament_id}
SELECT * 
FROM Matches 
WHERE tournament_id = ?;

-- Retrieve matches for a specific team
-- Arguments: {team_id}
SELECT * 
FROM Matches 
WHERE home_team_id = ? OR away_team_id = ?;

-- Retrieve match summary stats
-- Arguments: {match_id}
SELECT 
    ts.team_id, ts.possession_percent, ts.shots, ts.expected_goals, ts.passes, ts.tackles, ts.tackles_won, 
    ts.fouls_committed, ts.offsides, ts.corners, ts.free_kicks, ts.penalty_kicks, ts.yellow_cards, ts.red_cards
FROM Team_Match_Stats ts
WHERE ts.match_id = ?;

-- Update match details
-- Arguments: {match_id}, {match_date}, {match_time}, {match_status}, {home_team_score}, {away_team_score}
UPDATE Matches
SET match_date = ?, match_time = ?, match_status = ?, home_team_score = ?, away_team_score = ?
WHERE match_id = ?;
