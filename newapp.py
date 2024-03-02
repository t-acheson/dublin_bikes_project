from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import functools
from sshtunnel import SSHTunnelForwarder
import paramiko
import logging

app = Flask(__name__)

# SSH tunnel configuration
ssh_tunnel_config = {
    'ssh_address_or_host': ('ec2-16-171-176-24.eu-north-1.compute.amazonaws.com',22),
    'ssh_username': 'ubuntu',
    'ssh_pkey': 'awsFlask.pem',
    'remote_bind_address': ('dublinbikes20.c9g2qa8qkqxt.eu-north-1.rds.amazonaws.com', 3306),
    'local_bind_address': ('0.0.0.0', 3306                         
                           ),
}

# Set up logging to see more details
logging.basicConfig(level=logging.DEBUG)

try:
    # Test SSH connection before creating the tunnel
    with paramiko.SSHClient() as ssh_client:
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect(
            hostname=ssh_tunnel_config['ssh_address_or_host'][0],
            port=ssh_tunnel_config['ssh_address_or_host'][1],
            username=ssh_tunnel_config['ssh_username'],
            key_filename=ssh_tunnel_config['ssh_pkey']
        )
        print("SSH connection successful")

    # Set up SSH tunnel
    with SSHTunnelForwarder(**ssh_tunnel_config) as tunnel:
        # Update Flask app database URI to use the local port through the SSH tunnel
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


        '''@app.route("/currentstations")
        @functools.lru_cache(maxsize=128)
        def get_current_stations_info():
            # Establish a database connection
            database = connect_to_db()

            # Define the SQL query
            query = "SELECT * FROM currentstations;"
            
            try:
                with database.connect() as connection:
                    result = connection.execute(text(query))
                    currentstations_data = [dict(row) for row in result.fetchall()]
                    
                    # print('#found {} stations', len(rows), rows)
                    return jsonify(currentstations_data)


            except Exception as e:
                error_message = f"An error occurred while fetching station data: {e}"
                print(error_message)
                return jsonify({'error': error_message}), 500

            #except:
             #   print(traceback.format_exc())
              #  return "error in current stations", 404'''



except Exception as e:
    print(f"Error establishing SSH tunnel: {e}")

    
        
        

    # if __name__ == "__main__":
    #     app.run(debug=True)