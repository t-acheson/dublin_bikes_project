# COMP30830 Dublin Bikes Group Assignment
![image1](https://github.com/t-acheson/dublin_bikes_project/assets/101838855/49f1492b-6569-469f-ac1b-fc1f65c0f456)
## Project 
This project was for COMP30830. The goal of this project was to develop a web application to display occupancy and weather information for Dublin Bikes.

## Contents

`web/`
- `mlModel/`
    - Contains notebooks for model serialization, pickle file creation, and metric assessment.
- `static/`
    -Holds images, CSS, JavaScript, and JSON files for web interface styling and functionality.
    - `images/`
    - `index.css`
    - `index.js`
    - `weather-icons.json`
- `templates/`
    - Stores HTML templates for rendering web pages.
    - `index.html`
    - `weather.html`
- `app.py`
    - Main application file responsible for routing and server setup.
- `config.py`
    -  Configuration file for application settings.
- `occupany.py`
    - Script to calculate average historical occupancy of a given station. 
- `predict.py`
    - Script to handle the machine learning models.
 
  
## Requirements
[x] data collection through JCDecaux API

[x] data management/storage in RDS DB on AWS

[x] display bike stations on map

[x] flask web application (python)

[x] occupancy information

[x] weather information

[x] interactivity (click, API request, handle response)

[x] ML model for predicting occupancy based on weather patterns, trained on
collected data

[x] project served on a named host over the web on your EC2 instance

[x] Github repo, including source code, logs, commit history, branches, etc

