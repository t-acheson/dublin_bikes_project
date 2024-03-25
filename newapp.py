from flask import Flask, jsonify
import mysql.connector

app = Flask(__name__)

# Database configuration
DATABASE_CONFIG = {
    'user': 'root',
    'password': '', #INSERT YOUR OWN MYSQL WORKBENCH PASSWORD HERE
    'host': '127.0.0.1',
    'port': 3306,
    'database': 'dublinbikesgroup20',
}

# Function to connect to the database
def connect_db():
    return mysql.connector.connect(**DATABASE_CONFIG)

# API route to retrieve stations data
@app.route('/stations')
def get_stations():
    try:
        # Connect to the MySQL database
        db = connect_db()

        # Create a cursor object to execute SQL queries
        cur = db.cursor()

        # Execute the query to select all stations
        cur.execute('SELECT * FROM station')

        # Fetch all the results
        stations = cur.fetchall()

        # Close the cursor and database connection
        cur.close()
        db.close()

        # Convert the data to a list of dictionaries
        # Each dictionary represents a station
        stations_list = []
        for station in stations:
            station_dict = {
                'number': station[0],
                'address': station[1],
                'banking': station[2],
                'bike_stands': station[3],
                'name': station[4],
                'position_lat': station[5],
                'position_lng': station[6],
                # Add more fields if needed
            }
            stations_list.append(station_dict)

        # Return the stations data as JSON
        return jsonify({'stations': stations_list})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

# API route to retrieve weather data
@app.route('/weather')
def get_weather():
    try:
        # Connect to the MySQL database
        db = connect_db()

        # Create a cursor object to execute SQL queries
        cur = db.cursor()

        # Execute the query to select all weather
        cur.execute('SELECT * FROM weather_data ORDER BY id DESC LIMIT 1;')

        # Fetch all the results
        weather = cur.fetchall()

        # Close the cursor and database connection
        cur.close()
        db.close()

        return jsonify({'weather': weather}) 

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# API route to retrieve availability data
@app.route('/occupancy')
def get_occupancy():
    try:
        # Connect to the MySQL database
        db = connect_db()

        # Create a cursor object to execute SQL queries
        cur = db.cursor()

        id = 56 #for testing purposes. In final version expecting value to be passed in with the route call

        # Execute the query to select all occupancy
        cur.execute('SELECT * FROM availability where number = {} LIMIT 1;'.format(id))

        # Fetch all the results
        occupancy = cur.fetchall()

        # Close the cursor and database connection
        cur.close()
        db.close()

        return jsonify({'occupancy': occupancy}) 

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
