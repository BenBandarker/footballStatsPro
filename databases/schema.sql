CREATE TABLE IF NOT EXISTS Teams (
    team_id INT PRIMARY KEY AUTO_INCREMENT,
    team_api_id INT UNIQUE,
    team_name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    founded_year INT,
    stadium_name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Players (
    player_id INT PRIMARY KEY AUTO_INCREMENT,
    player_api_id INT UNIQUE,
    player_Fname VARCHAR(100) NOT NULL,
    player_Lname VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    nationality VARCHAR(50),
    height INT,
    weight INT,
    photo_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Tournaments (
    tournament_id INT PRIMARY KEY AUTO_INCREMENT,
    tournament_api_id INT UNIQUE,
    tournament_name VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    location VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Matches (
    match_id INT PRIMARY KEY AUTO_INCREMENT,
    match_api_id INT UNIQUE,
    home_team_id INT,
    away_team_id INT,
    tournament_id INT,
    match_date DATE,
    match_time TIME,
    match_status ENUM('Scheduled', 'In Play	', 'Finished', 'Postponed', 'Cancelled', 'Abandoned', 'Not Played'),
    home_team_score INT,
    away_team_score INT,
    FOREIGN KEY (home_team_id) REFERENCES Teams(team_id),
    FOREIGN KEY (away_team_id) REFERENCES Teams(team_id),
    FOREIGN KEY (tournament_id) REFERENCES Tournaments(tournament_id)
);

CREATE TABLE IF NOT EXISTS Player_Performance (
    performance_id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    minutes_played INT,
    position ENUM('Goalkeeper', 'Defender', 'Midfielder', 'Forward'),
    rating DECIMAL(3, 2),
    captain BOOLEAN DEFAULT FALSE,
    substitute BOOLEAN DEFAULT FALSE,
    offsides INT DEFAULT 0,
    total_shots INT DEFAULT 0,
    shots_on_target INT DEFAULT 0,
    goals INT DEFAULT 0,
    conceded_goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    saves INT DEFAULT 0,
    total_passes INT DEFAULT 0,
    key_passes INT DEFAULT 0,
    pass_accuracy DECIMAL(5, 2),
    total_tackles INT DEFAULT 0,
    blocks INT DEFAULT 0,
    interceptions INT DEFAULT 0,
    total_duels INT DEFAULT 0,
    duels_won INT DEFAULT 0,
    dribbles_attempted INT DEFAULT 0,
    dribbles_completed INT DEFAULT 0,
    dribble_pasts INT DEFAULT 0,
    fouls_drawn INT DEFAULT 0,
    fouls_committed INT DEFAULT 0,
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0,
    penalty_won INT DEFAULT 0,
    penalty_committed INT DEFAULT 0,
    penalty_scored INT DEFAULT 0,
    penalty_missed INT DEFAULT 0,
    penalty_saved INT DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES Players(player_id),
    FOREIGN KEY (match_id) REFERENCES Matches(match_id),
    UNIQUE KEY unique_player_team (player_id, match_id)
);

CREATE TABLE IF NOT EXISTS Team_Match_Stats (
    stat_id INT PRIMARY KEY AUTO_INCREMENT,
    match_id INT NOT NULL,
    team_id INT NOT NULL,
    shots_on_goal INT DEFAULT 0,
    shots_off_goal INT DEFAULT 0,
    total_shots INT DEFAULT 0,
    blocked_shots INT DEFAULT 0,
    shots_insidebox INT DEFAULT 0,
    shots_outsidebox INT DEFAULT 0,
    fouls INT DEFAULT 0,
    corner_kicks INT DEFAULT 0,
    offsides INT DEFAULT 0,
    ball_possession DECIMAL(5, 2),
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0,
    goalkeeper_saves INT DEFAULT 0,
    total_passes INT DEFAULT 0,
    passes_accurate INT DEFAULT 0,
    pass_accuracy DECIMAL(5, 2),
    FOREIGN KEY (match_id) REFERENCES Matches(match_id),
    FOREIGN KEY (team_id) REFERENCES Teams(team_id),
    UNIQUE KEY unique_match_team (match_id, team_id)
);

CREATE TABLE IF NOT EXISTS Team_Events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    match_id INT NOT NULL,
    team_id INT NOT NULL,
    player_id INT,
    assist_id INT,
    event_type ENUM('Goal', 'Corner', 'Offside', 'Foul', 'Penalty'),
    event_time INT NOT NULL,
    event_extra INT,
    FOREIGN KEY (match_id) REFERENCES Matches(match_id),
    FOREIGN KEY (team_id) REFERENCES Teams(team_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id),
    FOREIGN KEY (assist_id) REFERENCES Players(player_id),
    UNIQUE KEY unique_event (match_id, team_id, event_time, event_type)
);
