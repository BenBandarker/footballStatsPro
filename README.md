---

# **Soccer Stats Project**  
A multi-stage backend project for managing soccer statistics. This project evolves through various stages, incorporating SQL databases, APIs, cloud services (AWS), microservices architecture, and machine learning.  
author- Ben Bandarker.
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

### **Stage 2: API (Backend API Development)**  
- **Objective:** Develop RESTful APIs for interacting with the soccer stats database.  
- **Technologies:** Python (FastAPI/Flask), Postman for testing  
- **Key Features:**  
  - Endpoints for CRUD operations on players, teams, and matches.  
  - Filtering and searching capabilities for match stats, player performance and events.  
  - Secure access using authentication mechanisms.  


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
   cd rapidAPI
   node src/app.js
   ```  
3. Test endpoints using Postman or Swagger UI.  

#### **For Stage 3+ (AWS, Microservices, ML)**  
Steps will be added as the project progresses.  


## **Quick Start Guide**

### **1. Clone the Repository**
```bash
git clone https://github.com/BenBandarker/footballStatsPro.git
cd soccer-stats-project
```

### **2. Install Dependencies**
Make sure you have Node.js installed. Then run:
```bash
npm install
```

### **3. Configure the Database**
- Create a MySQL database (locally or in AWS RDS).
- Update the database credentials in `src/utils/dbConnection.js`.

### **4. Run the Server**
```bash
node src/app.js
```

### **5. Test with Postman**
- Import the collection or use endpoints such as:
  - `GET /players/search`
  - `POST /teams/import`
  - `DELETE /matches/delete`
- Make sure your server is running at `http://localhost:3000` or the configured port.


---

## **Folder Structure**  
```plaintext
FOOTBALLSTATSPRO/
│
├── databases/                  # SQL schema and sample data
│   ├── schema.sql              # Table definitions
│   ├── data.sql                # Sample records
│   └── queries/                # Reusable SQL queries
│
├── rapidAPI/                   # External API configurations
│   └── config/                 # API keys and base URLs
│
├── src/                        # Application source code
│   ├── controllers/            # Request handlers (import, get, delete)
│   ├── middlewares/           # Input validation and logic filters
│   ├── models/                # Database models and data structures
│   ├── routes/                # Express routes definition
│   ├── services/              # Business logic and database operations
│   └── utils/                 # Helpers (e.g. DB connection)
│   └── app.js                 # Main Express server entry point
│
├── .env                        # Environment variables (local use)
├── .env.example                # Template for environment config
├── .gitignore                  # Files to exclude from Git
├── package.json                # Project metadata and dependencies
├── package-lock.json           # Locked versions of dependencies
└── README.md                   # Project documentation instructions
```

---

## **Future Features**  
- Real-time match updates via a WebSocket API.  
- Advanced ML models for real-time game analytics.  
- Mobile app integration.  

---

<!-- ### **Stage 3: AWS (Cloud Integration)**  NOT IMPLEMENTED
- **Objective:** Deploy the database and API to AWS for scalability and availability.  
- **Technologies:** AWS RDS, AWS Lambda, AWS S3  
- **Key Features:**  
  - Database hosted on AWS RDS for global access.  
  - API deployed using AWS Lambda or EC2 instances.  
  - Cloud storage integration for match reports, images, or media.  

### **Stage 4: Microservices Architecture**  NOT IMPLEMENTED
- **Objective:** Modularize the backend into independent microservices.  
- **Technologies:** Docker, Kubernetes, RabbitMQ/Kafka  
- **Key Features:**  
  - Separate services for player stats, match stats, and team data.  
  - Communication via message queues or APIs.  
  - Scalability and fault tolerance through container orchestration.  

### **Stage 5: Machine Learning (Predictive Analytics)**  NOT IMPLEMENTED
- **Objective:** Use historical data to predict player performance and match outcomes.  
- **Technologies:** Python (scikit-learn, TensorFlow), Jupyter Notebooks  
- **Key Features:**  
  - Models for player ranking, injury prediction, and match result forecasting.  
  - Data pipelines for pre-processing and training.  
  - Integration of ML models with the API for real-time predictions.  

## TODO
## API
  - Stage 3
  - Stage 4
  - Stage 5
   -->