
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
app = Flask (__name__, static_url_path = '')

def connect_to_db():
# Configure the database URI (Change this based on your database)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///example.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    connection = mysql.connector.connect(
                host = "dublinbikes20.c9g2qa8qkqxt.eu-north-1.rds.amazonaws.com",
                database = "dublinbikesgroup20",
                user = "admin",
                password = "dublinbikesgroup20",
            )

    # Create SQLAlchemy database instance
    db = SQLAlchemy(app)

    return db


#@app.route('/')
#def hello_world():
    #return 'Hello World!'
    #return app.send_static_file('index.html')

@app.route('/station_data')
def get_stationdata():
    #connect to db
    #sql query to get station data
    # save it to a json

# Connect to the database
    # Perform SQL query to get station data (modify this query based on your schema)
    stations = Station.query.all()

    # Save station data to a JSON file (modify this based on your specific data)
    data = [{'id': station.id, 'name': station.name, 'location': station.location} for station in stations]

    # Example: Save data to a JSON file named 'station_data.json'
    with open('station_data.json', 'w') as json_file:
        json_file.write(json.dumps(data))

    # Return a message or redirect to a page
    return 'JSON file created successfully'

    return 'json file'
    return app.send_static_file('index.html')


@app.route('/weather_data')
def get_weatherdata():
    #connect to db
    #sql query to get station data
    # save it to a json
    

# Connect to the database
    # Perform SQL query to get station data (modify this query based on your schema)
    weather = Weather.query.all()

    # Save station data to a JSON file (modify this based on your specific data)
    data = [{'name': location.id, 'tempature': .name, 'location': station.location} for station in stations]

    # Example: Save data to a JSON file named 'station_data.json'
    with open('weather_data.json', 'w') as json_file:
        json_file.write(json.dumps(data))

    # Return a message or redirect to a page
    return 'JSON file created successfully'

    return 'json file'
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run (debug = True)

