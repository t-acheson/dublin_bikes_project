from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import functools

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://admin:dublinbikesgroup20@0.0.0.0:3306/dublinbikesgroup20'
db = SQLAlchemy(app)

def connect_to_db():
    return db


@app.route("/stations")
@functools.lru_cache(maxsize=128)
def get_stations():
        # Establish a database connection
        database = connect_to_db()

        # Define the SQL query
        query = "SELECT * FROM station;"

        try:
            # Execute the query and fetch all rows
            with database.connect() as connection:
                result = connection.execute(text(query))
                stations_data = [dict(row) for row in result.fetchall()]

            # Return the station data as JSON
            return jsonify(stations_data)

        except Exception as e:
            error_message = f"An error occurred while fetching stations data: {e}"
            print(error_message)
            return jsonify({'error': error_message}), 500
        
    
@app.route("/occupancy/<int:station_id>")
def get_occupancy(station_id):
        # Establish a database connection
        database = connect_to_db()

        # Define the SQL query for occupancy
        query = "SELECT * FROM station WHERE number = :station_id ORDER BY last_update LIMIT 1;"

        try:
            # Execute the query and fetch the row
            with database.connect() as connection:
                result = connection.execute(text(query), station_id=station_id)
                occupancy_data = [dict(row) for row in result.fetchall()]

            # Return the occupancy data as JSON
            return jsonify(bikes_available=occupancy_data)

        except Exception as e:
            error_message = f"An error occurred while fetching occupancy data for station {station_id}: {e}"
            print(error_message)
            return jsonify({'error': error_message}), 500
        
    
@app.route("/weather")
@functools.lru_cache(maxsize=128)
def get_weather():
        #Establish a database connection
        database = connect_to_db()

        # Define the SQL query
        query = "SELECT * FROM weather;"

        try:
            # Execute the query and fetch all rows
            with database.connect() as connection:
                result = connection.execute(text(query))
                weather_data = [dict(row) for row in result.fetchall()] #fetchall needs to be adapted to match db first/last

            # Return the weather data as JSON
            return jsonify(weather_data)

        except Exception as e:
            error_message = f"An error occurred while fetching weather data: {e}"
            print(error_message)
            return jsonify({'error': error_message}), 500
    
if __name__ == "__main__":
    app.run(debug=True)