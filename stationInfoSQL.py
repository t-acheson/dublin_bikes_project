
#import stuff
import requests
import json
from pprint import pprint 
import time 
import mysql.connector 
# import awsFlask.pem as key




def store(data):
    # Convert the data to a JSON string
    json_data = json.dumps(data, indent=4)

    # Write the JSON string to a file
    with open('stations_data.json', 'w') as f:
        f.write(json_data)

def stationsToTables():
    # while True:  # Run forever
        try:
            r = requests.get(STATIONS, params={"apiKey": APIKEY, "contract": NAME})
            data = json.loads(r.text)  # Use r.text instead of r.test
            store(data)  # Call the store function with the parsed data
            
            print("working 1")
            #open db connection here 
            connection = mysql.connector.connect(
                host,
                databasename,
                user,
                password
            )
            print("problem here")
            # Create a cursor object to execute SQL commands
            cursor = connection.cursor()
            print("working 2")
             # Loop over the data and insert each record into the database
            for record in data:
                number = record['number']
                name = record['name']
                address = record['address']
                banking = int(record['banking'])  # Convert boolean to int
                bike_stands = record['bike_stands']
                position_lat = record['position']['lat']

            # Construct the SQL command
            sql = """
            INSERT INTO station (number, name, address, banking, bike_stands, position_lat, position_lng)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            print("working 3")
            # Execute the SQL command
            cursor.execute(sql, (number, name, address, banking, bike_stands, position_lat, position_lng))

            # Commit the changes and close the connection
            connection.commit()
            connection.close()



            #sql commands go here 
            # mysql -u user -p -e "INSERT INTO station (number, name, address, banking, bike_stands, position_lat, position_lng) VALUES ($number, '$name', '$address', $banking, $bike_stands, $position_lat, $position_lng);" database_name



        except Exception as e:
            print("error") #additional error handling to go here & eventually print into the no hang up file on EC2
            

        # Sleep for  5 minutes
        # time.sleep(5 *  60) #use cron its on ubuntu
        
stationsToTables()