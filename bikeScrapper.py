#import stuff
import requests
import json
from pprint import pprint 
import mysql.connector 
# import datetime
import time 




NAME = "Dublin" #name of contract
STATIONS = "https://api.jcdecaux.com/vls/v1/stations?"
APIKEY = "9923c4b16f8c5fd842f2f448564bed43a349fa47"


def store(data):
    # Convert the data to a JSON string
    json_data = json.dumps(data, indent=4)

    # Write the JSON string to a file
    with open('stations_data.json', 'w') as f:
        f.write(json_data)

def bikesToTables():
    while True:  # Run forever
        try:
            r = requests.get(STATIONS, params={"apiKey": APIKEY, "contract": NAME})
            data = json.loads(r.text)  # Use r.text instead of r.test
            store(data)  # Call the store function with the parsed data

           #open db connection here 
            connection = mysql.connector.connect(
                host = "dublinbikes20.c9g2qa8qkqxt.eu-north-1.rds.amazonaws.com",
                database = "dublinbikesgroup20",
                user = "admin",
                password = "dublinbikesgroup20",
            )
            
            # Create a cursor object to execute SQL commands
            cursor = connection.cursor()
            
            #  Loop over the data and insert each record into the database
            for record in data:
                try:
                    number = record['number']
                    last_update = record['last_update'] #need to convert to actual time - handle later 
                    available_bikes = record['available_bikes']
                    available_bike_stands = record['available_bike_stands']
                    status = record['status']
                except:
                    print("Duplicate for station number: " + number +", not printing.")



                #   # get updated time into usable format
                # utc_now = datetime.now(timezone.utc)
                # formatted_utc_now = utc_now.strftime('%Y-%m-%d %H:%M:%S')
                # last_update_timestamp = record.get('last_update') / 1000.0
                # last_update_datetime = datetime.utcfromtimestamp(last_update_timestamp)

                
            # Construct the SQL command
                sql = """
                INSERT INTO availability (number, available_bikes, available_bike_stands, status, last_update)
                VALUES (%s, %s, %s, %s, %s)
                """
                 
                # Execute the SQL command
                cursor.execute(sql, (number, available_bikes, available_bike_stands, status, last_update))

                # Commit the changes 
                connection.commit()
            # close the connection
            connection.close()
#           Sleep for  5 minutes
            time.sleep(5 *  60) 
        

        except Exception as e:
            
            print(e)

  
bikesToTables()
