# Navigated Learning

**Navigated Learning** is an innovative educational paradigm that balances scale, personalization, and social interaction. The project represents learning as progress within a 2D competency space, embedding learners, resources, and activities using BERT-based semantic models. This allows for personalized feedback, learner tracking, and insights into strengths and weaknesses, providing both teachers and learners with actionable data.

## Features

- **Learning Map**: A 2D visual representation of each learner’s progress and competency across course topics.
- **Polylines**: Vectors representing a learner's performance, mapped against course topics using BERT embeddings.
- **Personalized Feedback**: Identifies learner strengths, weaknesses, and areas for targeted teaching.
- **Collaborative Learning**: Facilitates group formation and TA assignment based on complementary skills.
- **Instructor Insights**: Visual summaries of class performance and topic proficiency.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Flask
- **Database**: MySQL (connected via SQLAlchemy ORM)
- **Machine Learning**: BERT for generating semantic embeddings

## Key Dependencies & APIs

- **BERT (via `transformers` library)**:  
  Used to generate semantic embeddings for course topics, resources, and learner contributions. These embeddings form the basis for the polylines representing learner progress.

- **D3.js**:  
  Utilized for creating dynamic and interactive visualizations like the Learner Map, which plots learners' progress in a 2D space.

- **Material UI & React-Bootstrap**:  
  Libraries used for building responsive and modern user interfaces. Material UI provides a wide range of prebuilt components, while React-Bootstrap ensures consistent styling across the application.

- **SQLAlchemy**:  
  Provides an Object-Relational Mapping (ORM) layer to interact with the MySQL database, ensuring that data models are cleanly connected to the relational database without needing to write raw SQL queries.

- **Torch**:  
  A deep learning library used alongside BERT for efficient embedding computations, enabling the real-time generation of learner and resource vectors.

- **Flask**:  
  A lightweight backend framework used to handle API requests and serve data between the frontend and the database.

- **Axios**:  
  A promise-based HTTP client for React used to make requests from the frontend to the Flask backend.

## Project Setup

### Frontend

1. Navigate to the frontend/ directory.
2. Install the required dependencies:
 -  npm install

3. Start the development server:

  - npm start
### Backend
1. Navigate to the backend/ directory.
2. Install the required Python packages:
- pip install -r requirements.txt
3. Start the Flask server:
 - python3 app.py
### Database
1. Install MySQL and log in as root:
 - sudo apt install mysql-server
 - mysql -u root -p
2. Create a new MySQL user with username and password 1234:

 - CREATE USER '1234'@'localhost' IDENTIFIED BY '1234';
 - GRANT ALL PRIVILEGES ON *.* TO '1234'@'localhost';
 - FLUSH PRIVILEGES;


## Core Components

### Learning Map
A 2D map visualizes the learner's competency space across various topics. The map is generated using D3.js, with the polylines representing the learner's progress.

### Polylines
Polylines are vectors representing a learner’s interaction with course topics and resources. These are computed using BERT embeddings based on the learner’s activities like quizzes, assignments, and resource usage.

### Embedding Generation
We use the BERT model to generate embeddings for the topics and resources. The process includes:

1. Converting course resources into text.
2. Summarizing text and extracting keywords.
3. Using BERT to generate embeddings that form the basis of the resource and learner polylines.
