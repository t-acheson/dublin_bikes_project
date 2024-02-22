#import stuff
import requests
import json
from pprint import pprint 
import time 
import mysql.connector 


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
                host ="localhost goes here"
                database ="x"
                user="y"
                password="z"
            )
            
            #sql commands go here 

        except Exception as e:
            print("error") #additional error handling to go here & eventually print into the no hang up file on EC2
            

        # Sleep for  5 minutes
        # time.sleep(5 *  60) #use cron its on ubuntu
        
bikesToTables()
