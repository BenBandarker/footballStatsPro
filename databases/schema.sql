CREATE TABLE IF NOT EXISTS Teams (
    team_id INT PRIMARY KEY AUTO_INCREMENT,
    team_api_id BIGINT UNIQUE,
    team_name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    founded_year INT,
    stadium_name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Players (
    player_id INT PRIMARY KEY AUTO_INCREMENT,
    player_api_id BIGINT UNIQUE,
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
    tournament_api_id BIGINT UNIQUE,
    tournament_name VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    location VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Matches (
    match_id INT PRIMARY KEY AUTO_INCREMENT,
    match_api_id BIGINT UNIQUE,
    home_team_id BIGINT,
    away_team_id BIGINT,
    tournament_id BIGINT,
    match_date DATE,
    match_time TIME,
    match_status ENUM('Scheduled', 'In Play	', 'Finished', 'Postponed', 'Cancelled', 'Abandoned', 'Not Played'),
    home_team_score INT,
    away_team_score INT,
    FOREIGN KEY (home_team_id) REFERENCES Teams(team_api_id) ON DELETE SET NULL,
    FOREIGN KEY (away_team_id) REFERENCES Teams(team_api_id) ON DELETE SET NULL,
    FOREIGN KEY (tournament_id) REFERENCES Tournaments(tournament_api_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Player_Performance (
    performance_id INT PRIMARY KEY AUTO_INCREMENT,
    player_id BIGINT NOT NULL,
    match_id BIGINT NOT NULL,
    minutes_played INT NULL,
    position ENUM('Goalkeeper', 'Defender', 'Midfielder', 'Forward') NULL,
    rating DECIMAL(3, 2) NULL,
    captain BOOLEAN DEFAULT FALSE NULL,
    substitute BOOLEAN DEFAULT FALSE NULL, 
    offsides INT DEFAULT 0 NULL,
    total_shots INT DEFAULT 0 NULL,
    shots_on_target INT DEFAULT 0 NULL,
    goals INT DEFAULT 0 NULL,
    conceded_goals INT DEFAULT 0 NULL,
    assists INT DEFAULT 0 NULL,
    saves INT DEFAULT 0 NULL,
    total_passes INT DEFAULT 0 NULL,
    key_passes INT DEFAULT 0 NULL,
    pass_accuracy DECIMAL(5, 2) NULL,
    total_tackles INT DEFAULT 0 NULL,
    blocks INT DEFAULT 0 NULL,
    interceptions INT DEFAULT 0 NULL,
    total_duels INT DEFAULT 0 NULL,
    duels_won INT DEFAULT 0 NULL,
    dribbles_attempted INT DEFAULT 0 NULL,
    dribbles_completed INT DEFAULT 0 NULL,
    dribble_pasts INT DEFAULT 0 NULL,
    fouls_drawn INT DEFAULT 0 NULL,
    fouls_committed INT DEFAULT 0 NULL,
    yellow_cards INT DEFAULT 0 NULL,
    red_cards INT DEFAULT 0 NULL, 
    penalty_won INT DEFAULT 0 NULL,
    penalty_committed INT DEFAULT 0 NULL,
    penalty_scored INT DEFAULT 0 NULL,
    penalty_missed INT DEFAULT 0 NULL,
    penalty_saved INT DEFAULT 0 NULL,
    FOREIGN KEY (player_id) REFERENCES Players(player_api_id),
    FOREIGN KEY (match_id) REFERENCES Matches(match_api_id),
    UNIQUE KEY unique_player_team (player_id, match_id)
);

CREATE TABLE IF NOT EXISTS Team_Match_Stats (
    stat_id INT PRIMARY KEY AUTO_INCREMENT,
    match_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    shots_on_goal INT DEFAULT 0 NULL,
    shots_off_goal INT DEFAULT 0 NULL,
    total_shots INT DEFAULT 0 NULL,
    blocked_shots INT DEFAULT 0 NULL,
    shots_insidebox INT DEFAULT 0 NULL,
    shots_outsidebox INT DEFAULT 0 NULL,
    fouls INT DEFAULT 0 NULL,
    corner_kicks INT DEFAULT 0 NULL,
    offsides INT DEFAULT 0 NULL,
    ball_possession DECIMAL(5, 2) NULL,
    yellow_cards INT DEFAULT 0 NULL,
    red_cards INT DEFAULT 0 NULL,
    goalkeeper_saves INT DEFAULT 0 NULL,
    total_passes INT DEFAULT 0 NULL,
    passes_accurate INT DEFAULT 0 NULL,
    pass_accuracy DECIMAL(5, 2) NULL,
    FOREIGN KEY (match_id) REFERENCES Matches(match_api_id),
    FOREIGN KEY (team_id) REFERENCES Teams(team_api_id),
    UNIQUE KEY unique_match_team (match_id, team_id)
);

CREATE TABLE IF NOT EXISTS Team_Events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    match_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    player_id BIGINT DEFAULT NULL,
    assist_id BIGINT DEFAULT NULL,
    event_type ENUM('Goal', 'Corner', 'Offside', 'Foul', 'Penalty', 'Card', 'Subst', 'Var'),
    event_time INT NOT NULL,
    event_extra INT,
    FOREIGN KEY (match_id) REFERENCES Matches(match_api_id),
    FOREIGN KEY (team_id) REFERENCES Teams(team_api_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_api_id) ON DELETE SET NULL,
    FOREIGN KEY (assist_id) REFERENCES Players(player_api_id) ON DELETE SET NULL,
    UNIQUE KEY unique_event (match_id, team_id, player_id, event_time, event_type)
);
