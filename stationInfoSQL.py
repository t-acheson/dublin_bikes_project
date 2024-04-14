
#import stuff
import requests
import json
import mysql.connector 


#dublinbike API info 
NAME = "Dublin" #name of contract
STATIONS = "https://api.jcdecaux.com/vls/v1/stations?"
APIKEY = "9923c4b16f8c5fd842f2f448564bed43a349fa47"


def store(data):
    # Convert the data to a JSON string
    json_data = json.dumps(data, indent=4)

    # Write the JSON string to a file
    with open('stations_data.json', 'w') as f:
        f.write(json_data)

def stationsToTables():
        try:
            r = requests.get(STATIONS, params={"apiKey": APIKEY, "contract": NAME})
            data = json.loads(r.text)  # Use r.text instead of r.test
            store(data)  # Call the store function with the parsed data
            
            
            #open db connection here 
            connection = mysql.connector.connect(
                host = "dublinbikes20.c9g2qa8qkqxt.eu-north-1.rds.amazonaws.com",
                database = "dublinbikesgroup20",
                user = "root",
                password = "lemon",
            )
            
            # Create a cursor object to execute SQL commands
            cursor = connection.cursor()
            
             # Loop over the data and insert each record into the database
            for record in data:
                number = record['number']
                name = record['name']
                address = record['address']
                banking = int(record['banking'])  # Convert boolean to int
                bike_stands = record['bike_stands']
                position_lat = record['position']['lat']
                position_lng = record['position']['lng']

            # Construct the SQL command
                sql = """
                INSERT INTO station (number, name, address, banking, bike_stands, position_lat, position_lng)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                 
                # Execute the SQL command
                cursor.execute(sql, (number, name, address, banking, bike_stands, position_lat, position_lng))

                # Commit the changes 
                connection.commit()
            # close the connection
            connection.close()
            print("station scrapper running daily")



        except Exception as e:
            
            print(e)

    
stationsToTables()