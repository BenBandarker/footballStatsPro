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
    distance_covered DECIMAL(5, 2),
    distance_sprinted DECIMAL(5, 2),
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    shots INT DEFAULT 0,
    shot_accuracy DECIMAL(5, 2),
    passes INT DEFAULT 0,
    pass_accuracy DECIMAL(5, 2),
    tackles INT DEFAULT 0,
    tackles_won INT DEFAULT 0,
    fouls_committed INT DEFAULT 0,
    possession_won INT DEFAULT 0,
    possession_lost INT DEFAULT 0,
    dribbles INT DEFAULT 0,
    dribbles_completed INT DEFAULT 0,
    dribble_success_rate DECIMAL(5, 2),
    match_rating DECIMAL(3, 2),
    player_of_the_match BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (player_id) REFERENCES Players(player_id),
    FOREIGN KEY (match_id) REFERENCES Matches(match_id)
);

CREATE TABLE IF NOT EXISTS Team_Match_Stats (
    stat_id INT PRIMARY KEY AUTO_INCREMENT,
    match_id INT NOT NULL,
    team_id INT NOT NULL,
    possession_percent DECIMAL(5, 2),
    shots INT DEFAULT 0,
    expected_goals DECIMAL(5, 2),
    passes INT DEFAULT 0,
    tackles INT DEFAULT 0,
    tackles_won INT DEFAULT 0,
    fouls_committed INT DEFAULT 0,
    offsides INT DEFAULT 0,
    corners INT DEFAULT 0,
    free_kicks INT DEFAULT 0,
    penalty_kicks INT DEFAULT 0,
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0,
    FOREIGN KEY (match_id) REFERENCES Matches(match_id),
    FOREIGN KEY (team_id) REFERENCES Teams(team_id)
);

CREATE TABLE IF NOT EXISTS Team_Events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    match_id INT NOT NULL,
    team_id INT NOT NULL,
    event_type ENUM('Goal', 'Corner', 'Offside', 'Foul', 'Penalty'),
    event_time INT NOT NULL,
    FOREIGN KEY (match_id) REFERENCES Matches(match_id),
    FOREIGN KEY (team_id) REFERENCES Teams(team_id)
);
