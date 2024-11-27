CREATE TABLE Teams (
    team_id INT PRIMARY KEY AUTO_INCREMENT,
    team_name VARCHAR(100) NOT NULL,
    founded_year INT,
    stadium_name VARCHAR(100),
    manager_name VARCHAR(100)
);

CREATE TABLE Players (
    player_id INT PRIMARY KEY AUTO_INCREMENT,
    player_name VARCHAR(100) NOT NULL,
    team_id INT,
    date_of_birth DATE,
    position VARCHAR(50),
    nationality VARCHAR(50),
    FOREIGN KEY (team_id) REFERENCES Teams(team_id)
);

CREATE TABLE Tournaments (
    tournament_id INT PRIMARY KEY AUTO_INCREMENT,
    tournament_name VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE
    year INT,
    location VARCHAR(50)
);

CREATE TABLE MATCHES (
    match_id INT PRIMARY KEY AUTO_INCREMENT,
    home_team_id INT,
    away_team_id INT,
    tournament_id INT,
    match_date DATE,
    match_time TIME,
    match_status ENUM('Scheduled', 'Playing', 'Played', 'Postponed'),
    home_team_score INT,
    away_team_score INT,
    FOREIGN KEY (home_team_id) REFERENCES Teams(team_id),
    FOREIGN KEY (away_team_id) REFERENCES Teams(team_id),
    FOREIGN KEY (tournament_id) REFERENCES TOURNAMENTS(tournament_id)
);

CREATE TABLE Players_Stats(
    stat_id INT PRIMARY KEY AUTO_INCREMENT,
    match_id INT NOT NULL,
    player_id INT NOT NULL,
    minutes_played INT NOT NULL,
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0,
    FOREIGN KEY (match_id) REFERENCES Matches(match_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
);

CREATE TABLE Matches_Stats(
    team_stat_id INT PRIMARY KEY AUTO_INCREMENT,
    match_id INT NOT NULL,
    team_id INT NOT NULL,
    possession_percent DECIMAL(5, 2),
    shots INT DEFAULT 0,
    shots_on_target INT DEFAULT 0,
    fouls INT DEFAULT 0,
    corners INT DEFAULT 0,
    offsides INT DEFAULT 0,
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0,
    FOREIGN KEY (match_id) REFERENCES Matches(match_id),
    FOREIGN KEY (team_id) REFERENCES Teams(team_id)
);

CREATE TABLE Match_Events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,         -- Unique ID for each event
    match_id INT NOT NULL,                           -- Link to the match where the event occurred
    team_id INT NOT NULL,                            -- Team involved in the event
    player_id INT NULL,                              -- Player involved (if applicable)
    event_type ENUM('Goal', 'Assist', 'Foul', 'Yellow Card', 
                    'Red Card', 'Substitution', 
                    'Offside', 'Penalty', 'Injury') NOT NULL, -- Type of event
    event_time INT NOT NULL,                         -- Minute of the match the event occurred
    additional_info VARCHAR(255),                   -- Extra details (e.g., "Penalty scored" or "Injury substitution")
    FOREIGN KEY (match_id) REFERENCES Matches(match_id),
    FOREIGN KEY (team_id) REFERENCES Teams(team_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
);