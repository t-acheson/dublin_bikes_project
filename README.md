# COMP30830 Dublin Bikes Group Assignment

## Contents

web/
- mlModel/
    - Contains notebooks for model serialization, pickle file creation, and metric assessment.
- static/
    -Holds images, CSS, JavaScript, and JSON files for web interface styling and functionality.
    - images/
    - index.css
    - index.js
    - weather-icons.json
- templates/
    - Stores HTML templates for rendering web pages.
    - index.html
    - weather.html
- app.py
    - Main application file responsible for routing and server setup.
- config.py
    -  Configuration file for application settings.
- occupany.py
    - Script to calculate average historical occupancy of a given station. 
- predict.py
    - Script to handle the machine learning models.
 
  
## Requirements
[] data collection through JCDecaux API

[] data management/storage in RDS DB on AWS

[] display bike stations on map

[] flask web application (python)

[] occupancy information

[] weather information

[] interactivity (click, API request, handle response)

[] ML model for predicting occupancy based on weather patterns, trained on
collected data

[] project served on a named host over the web on your EC2 instance

[] Github repo, including source code, logs, commit history, branches, etc



This assignment describes the project work for COMP30830. Refer also to the lecture
notes on Brightspace.
The goal of this project is to develop a web application to display occupancy and weather
information for Dublin Bikes.
You will conduct the project in a team using the Scrum methodology.
The project should be submitted before the last week of the module. This is a hard
deadline.

(a) [45]• Deliverable Project This is not an exhaustive list, but contains the main elements
of a working solution
1. data collection through JCDecaux API
2. data management/storage in RDS DB on AWS
3. display bike stations on map
4. flask web application (python)
5. occupancy information
©UCD Semester II/ Modular Page 1 of 2
6. weather information
7. interactivity (click, API request, handle response)
8. ML model for predicting occupancy based on weather patterns, trained on
collected data
9. project served on a named host over the web on your EC2 instance
10. Github repo, including source code, logs, commit history, branches, etc
11. 
(b) [45]• Project Management
1. Design, planning notes and materials, discussion of Requirements, mock-
ups, ...
2. Scrum project management (trello board, slack logs, google docs, etc)
3. Meeting notes (log of daily standup, notes from sprint reviews, retrospec-
tives
4. feature selection/product backlog for each sprint (× 4)
5. burndown charts, (sprint and/or release) for each sprint (× 4)
6. managing deliverables, prototypes
7. 
(c) [10]• Personal Notes (Individual Submission)
1. learning journal
2. personal review
3. retrospective of the project
