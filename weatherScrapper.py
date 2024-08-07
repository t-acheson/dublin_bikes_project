import requests
import json
import mysql.connector 
import web.config as config


class WeatherConfig:
    API_KEY=config.WEATHER_APIKEY
    Q=config.WEATHER_CITY
    URI="http://api.weatherapi.com/v1/current.json"



def store(w):
# Convert the data to a JSON string
    json_data = json.dumps(w, indent=4)

    # Write the JSON string to a file
    with open('stations_data.json', 'w') as f:
        f.write(json_data)



def weatherToTables():
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
            
            for record in w:
                name = w['location']['name']
                temp_c = w['current']['temp_c']
                weather_condition = w['current']['condition']['text']
                wind_mph = w['current']['wind_mph']
                wind_dir = w['current']['wind_dir']
                precip_mm = w['current']['precip_mm']
                last_updated = w['current']['last_updated']
                weather_icon = w['current']['condition']['icon']

                # Construct the SQL command
                sql = """
                INSERT INTO weather_data (name, temp_c, weather_condition, wind_mph, wind_dir, precip_mm, last_updated, weather_icon)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """
                
                # Execute the SQL command
                cursor.execute(sql, (name, temp_c, weather_condition, wind_mph, wind_dir, precip_mm, last_updated, weather_icon))

              # Commit the changes 
                connection.commit()
            # close the connection
            connection.close()
            print("weeather scrapper running hourly")

        except Exception as e:            
            print(e)

weatherToTables()