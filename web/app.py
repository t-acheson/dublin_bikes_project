
from flask import Flask, render_template
# from flask_sqlalchemy import SQLAlchemy #TODO check if this is actually needed, as connector was been working fine on ubuntu for data scrapping, may not need alchemy..
import mysql.connector 
import json 
app = Flask (__name__, static_url_path = '')


#@app.route('/')
#def hello_world():
    #return 'Hello World!'
    #return app.send_static_file('index.html')

@app.route('/station_data')
def get_stationdata():
    #connect to db
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///example.db'
    # app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

     #open db connection here 
    connection = mysql.connector.connect(
        host = "dublinbikes20.c9g2qa8qkqxt.eu-north-1.rds.amazonaws.com",
        database = "dublinbikesgroup20",
        user = "admin",
        password = "dublinbikesgroup20",
    )
    
    # Create a cursor object to execute SQL commands
    cursor = connection.cursor()
    
 
    #sql query to get station data
    # save it to a json
    # Execute the SQL query
    cursor.execute("SELECT number, name, address, banking, bike_stands, position_lat, position_lng FROM station;")

    # Fetch all rows from the cursor
    rows = cursor.fetchall()

    # Convert rows to a list of dictionaries
    stations_data = [dict(zip([column[0] for column in cursor.description], row)) for row in rows]

    # Convert the list of dictionaries to JSON
    stations_json = json.dumps(stations_data, indent=4)

    # # Save the JSON data to a file
    # with open('stations_data.json', 'w') as json_file:
    #     json_file.write(stations_json)

    # Close the cursor and connection
    cursor.close()
    connection.close()

    #reder html template & pass info into it 
    return render_template('station_data.html', stations_data=stations_json)


if __name__ == '__main__':
    app.run (debug = True)

