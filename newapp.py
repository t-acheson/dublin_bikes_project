from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from datetime import datetime
import functools
from sshtunnel import SSHTunnelForwarder

app = Flask(__name__)

# SSH tunnel configuration
ssh_tunnel_config = {
    'ssh_address_or_host': ('ec2-16-171-176-24.eu-north-1.compute.amazonaws.com', 22),
    'ssh_username': 'ubuntu',
    'ssh_pkey': '/path/to/your/private_key.pem',
    'remote_bind_address': ('dublinbikes20.c9g2qa8qkqxt.eu-north-1.rds.amazonaws.com', 3306),
    'local_bind_address': ('127.0.0.1', 3307),
}

# Set up SSH tunnel
with SSHTunnelForwarder(**ssh_tunnel_config) as tunnel:
    # Update Flask app database URI to use the local port through the SSH tunnel
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://admin:dublinbikesgroup20@localhost:3307/dublinbikesgroup20'

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

    if __name__ == "__main__":
        app.run(debug=True)

    
'''@app.route("/weather")
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
            weather_data = [dict(row) for row in result.fetchall()]

        # Return the weather data as JSON
        return jsonify(weather_data)

    except Exception as e:
        print(f"Error in get_weather: {e}")
        return "An error occurred while fetching weather data"'''

# if __name__ == "__main__":
#     app.run(debug=True)