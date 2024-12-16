---

# **Soccer Stats Project**  
A multi-stage backend project for managing soccer statistics. This project evolves through various stages, incorporating SQL databases, APIs, cloud services (AWS), microservices architecture, and machine learning.  
authors- Ben Bandarker, Or Salem.
---

## **Project Overview**  
The Soccer Stats project is designed to handle data related to soccer, including player stats, team stats, match events, and tournaments. It aims to develop a scalable, modular, and intelligent backend system using modern technologies.

---

## **Project Stages**  

### **Stage 1: SQL (Database Design and Implementation)**  
- **Objective:** Design and implement a robust relational database schema for soccer statistics.  
- **Technologies:** MySQL  
- **Key Features:**  
  - Tables for players, teams, matches, tournaments, player statistics, match statistics, and match events.  
  - Queries for fetching player stats, team performance, and match summaries.  
- **Progress:**  
  - Database schema designed and implemented.  
  - Basic and advanced SQL queries written for data retrieval and manipulation.  

### **Stage 2: API (Backend API Development)**  
- **Objective:** Develop RESTful APIs for interacting with the soccer stats database.  
- **Technologies:** Python (FastAPI/Flask), Postman for testing  
- **Key Features:**  
  - Endpoints for CRUD operations on players, teams, and matches.  
  - Filtering and searching capabilities for match stats and events.  
  - Secure access using authentication mechanisms.  

### **Stage 3: AWS (Cloud Integration)**  
- **Objective:** Deploy the database and API to AWS for scalability and availability.  
- **Technologies:** AWS RDS, AWS Lambda, AWS S3  
- **Key Features:**  
  - Database hosted on AWS RDS for global access.  
  - API deployed using AWS Lambda or EC2 instances.  
  - Cloud storage integration for match reports, images, or media.  

### **Stage 4: Microservices Architecture**  
- **Objective:** Modularize the backend into independent microservices.  
- **Technologies:** Docker, Kubernetes, RabbitMQ/Kafka  
- **Key Features:**  
  - Separate services for player stats, match stats, and team data.  
  - Communication via message queues or APIs.  
  - Scalability and fault tolerance through container orchestration.  

### **Stage 5: Machine Learning (Predictive Analytics)**  
- **Objective:** Use historical data to predict player performance and match outcomes.  
- **Technologies:** Python (scikit-learn, TensorFlow), Jupyter Notebooks  
- **Key Features:**  
  - Models for player ranking, injury prediction, and match result forecasting.  
  - Data pipelines for pre-processing and training.  
  - Integration of ML models with the API for real-time predictions.  

---

## **How to Run the Project**  

### **Prerequisites**  
- MySQL installed locally or hosted on AWS RDS.  
- Python 3.9+ with necessary libraries installed.  
- AWS account with access to required services.  

### **Steps**  

#### **For Stage 1 (SQL)**  
1. Clone the repository.  
2. Navigate to the `/sql` folder.  
3. Import the `soccer_stats.sql` file into your MySQL server.  
4. Use the provided SQL queries for data retrieval.  

#### **For Stage 2 (API)**  
1. Navigate to the `/api` folder.  
2. Run the FastAPI/Flask server using:  
   ```bash
   python main.py
   ```  
3. Test endpoints using Postman or Swagger UI.  

#### **For Stage 3+ (AWS, Microservices, ML)**  
Steps will be added as the project progresses.  

---

## **Folder Structure**  
```plaintext
soccer-stats-project/
│
├── databases/                      # Stage 1: SQL-related files
│   ├── data.sql      #sample data
│   ├── schema.sql      # Database schema and sample data
│   ├── queries/              # SQL query files
│       ├── match_queries.sql      
│       ├── player_queries.sql  
│       ├── team_queries.sql  
│
├── api/                      # Stage 2: API code
│   ├── main.py               # Entry point for the API
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── tests/                # API tests
│
├── aws/                      # Stage 3: AWS deployment configs
│   ├── terraform/            # Terraform configs for AWS services
│   ├── lambda/               # Lambda function code
│
├── microservices/            # Stage 4: Microservices-related files
│   ├── player-stats-service/ # Service for player stats
│   ├── match-stats-service/  # Service for match stats
│
├── ml/                       # Stage 5: Machine learning
│   ├── notebooks/            # Jupyter notebooks for ML experiments
│   ├── models/               # Trained models
│
└── README.md                 # Project description and instructions
```

---

## **Contributing**  
1. Fork the repository.  
2. Create a feature branch:  
   ```bash
   git checkout -b feature-name
   ```  
3. Commit your changes and push them.  
4. Create a pull request.  

---

## **Future Features**  
- Real-time match updates via a WebSocket API.  
- Advanced ML models for real-time game analytics.  
- Mobile app integration.  

---



## TODO
## API
  - add code to insert the data to databases.
  - add code to change data on sql base on existing data.
  - add init + update to api data
  - expand Controllers - more fetch funcion - with paramaters
    - fetch statistic
  - add Contollers to statisics.
    
  - add entitys \
    - including matches entity + videoAPI