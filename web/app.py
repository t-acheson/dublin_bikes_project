from flask import Flask, jsonify, render_template, request
import mysql.connector
import pickle
import pandas as pd 
import predict
import occupancy 
from flask_cors import CORS 
# ! have to pip install flask_cors on each machine

app = Flask(__name__)
CORS(app)

# Database configuration
DATABASE_CONFIG = {
    'user': 'root',
    'password': 'Wingpunt96?', #INSERT YOUR OWN MYSQL WORKBENCH PASSWORD HERE
    'host': '127.0.0.1',
    'port': 3306,
    'database': 'dublinbikesgroup20',
}

# Function to connect to the database
def connect_db():
    return mysql.connector.connect(**DATABASE_CONFIG)

# ! This Route works DO NOT TOUCH 
# API route to retrieve stations data
@app.route('/')
def get_data():
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
            }
            stations_list.append(station_dict)

        # Return the stations data as JSON
        #return jsonify({'stations': stations_list})

        # Connect to the MySQL database
        db = connect_db()

        # Create a cursor object to execute SQL queries
        cur = db.cursor()

        # Execute the query to select all weather
        cur.execute('SELECT * FROM weather_data ORDER BY id DESC LIMIT 1;')

        # Fetch all the results
        weather = cur.fetchall()
        cur.close()
        db.close()

        temp=weather[0][1] 
        cond=weather[0][2] 
        ws=weather[0][3]
        wd=weather[0][4]
        prec=weather[0][5]
        # Close the cursor and database connection
        return render_template('index.html', temp=temp, condition=cond, speed=ws, direction=wd, rain=prec, stations=stations_list )

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# TODO this route not currently working with JS 
# API route to retrieve availability data
@app.route('/occupancy/<stationid>') # id of station needs to be included here
def get_occupancy(stationid):
    try:
        # Connect to the MySQL database
        db = connect_db()

        # Create a cursor object to execute SQL queries
        cur = db.cursor()

        id = stationid #for testing purposes. In final version expecting value to be passed in with the route call

        # Execute the query to select all occupancy
        cur.execute('SELECT available_bikes, available_bike_stands, last_update FROM availability where number = {} LIMIT 1;'.format(id)) 

        # Fetch all the results
        occupancy = cur.fetchall()

        # Close the cursor and database connection
        cur.close()
        db.close()

        return jsonify({'occupancy': occupancy})  
   

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

# API route to retrieve last 7 days availability data
@app.route('/recentoccupancy/<stationid>') # id of station needs to be included here
def get_recentoccupancy(stationid):
    try:
        # Connect to the MySQL database
        db = connect_db()

        # Create a cursor object to execute SQL queries
        cur = db.cursor()

        id = stationid #for testing purposes. In final version expecting value to be passed in with the route call

        # Execute the query to select all occupancy
        cur.execute('SELECT available_bikes, available_bikes_stands, last_update FROM availability where number = {} LIMIT 2016;'.format(id)) 

        # Fetch all the results
        occupancy = cur.fetchall()

        # Close the cursor and database connection
        cur.close()
        db.close()

        return jsonify({'occupancy': occupancy})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

 
@app.route('/predict/<int:stationid>', methods=['POST']) # id of station needs to be included here
def predictAvailability(stationid):
    try:
        data = request.get_json()
        
        stationid = int(data.get('stationid'))
        temp_c = float(data.get('temp_c', 0))
        wind_mph = float(data.get('wind_mph', 0))
        precip_mm = float(data.get('precip_mm', 0))
        hours = float(data.get('hours', 0)) #TODO need to use input somehow here too 

        predicted_bikes = predict.predict(stationid, temp_c, wind_mph, precip_mm, hours)
        return jsonify({'predicted_bikes': predicted_bikes})
    except Exception as e:
        return jsonify({'error': str(e)})


# ! this route works DO NOT TOUCH 
# weather only route so i can use for predictions 
@app.route('/weather', methods=['POST'])
def get_weather():
    try:
        db = connect_db()
        cur = db.cursor()
        cur.execute('SELECT * FROM weather_data ORDER BY id DESC LIMIT 1;')
        weather = cur.fetchall()
        cur.close()
        db.close()

        if weather:
            return jsonify({
                'temp_c': weather[0][1],
                'wind_mph': weather[0][3],
                'precip_mm': weather[0][5]
            })
        else:
            return jsonify({'error': 'No weather data found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500






if __name__ == '__main__':
    app.run(debug=True)