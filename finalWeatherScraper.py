import requests
import json
import time 

class WeatherConfig:
    API_KEY="0f5a8ade5f024e70a34123035241602"
    Q="dublin"
    URI="http://api.weatherapi.com/v1/current.json"



def store(w):
    print(w)
    print(w['location']['name'])
    print(w['current']['temp_c'])
    print(w['current']['condition']['text'])
    print(w['current']['wind_mph'])
    print(w['current']['wind_dir'])
    print(w['current']['precip_mm'])



def weatherToTables():
    while True:  # Run forever
        try:
            weather_data=  requests.get(WeatherConfig.URI, params={"key":WeatherConfig.API_KEY, "q":WeatherConfig.Q})
            w = json.loads(weather_data.text)
            store(w)  # Call the store function with the parsed data


 #open db connection here 
            connection = mysql.connector.connect(
                host = "dublinbikes20.c9g2qa8qkqxt.eu-north-1.rds.amazonaws.com",
                database = "dublinbikesgroup20",
                user = "admin",
                password = "dublinbikesgroup20",
            )
            
            # Create a cursor object to execute SQL commands
            cursor = connection.cursor()
            
            #TODO change the following code to reflect the relevant table 
            #  # Loop over the data and insert each record into the database
            # for record in data:
            #     number = record['number']
            #     name = record['name']
            #     address = record['address']
            #     banking = int(record['banking'])  # Convert boolean to int
            #     bike_stands = record['bike_stands']
            #     position_lat = record['position']['lat']
            #     position_lng = record['position']['lng']

            # # Construct the SQL command
            #     sql = """
            #     INSERT INTO station (number, name, address, banking, bike_stands, position_lat, position_lng)
            #     VALUES (%s, %s, %s, %s, %s, %s, %s)
            #     """
                 
            #     # Execute the SQL command
            #     cursor.execute(sql, (number, name, address, banking, bike_stands, position_lat, position_lng))

            #     # Commit the changes 
            #     connection.commit()
            # close the connection
            connection.close()


            # Sleep for  5 minutes
            # time.sleep(5 *  60) #use cron its on ubuntu
           

        except Exception as e:
            print("error")
            # print(traceback.format_exc())  # Print exception details
            # You can add additional error handling logic here

weatherToTables()