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

            # Sleep for  5 minutes
            time.sleep(5 *  60) #use cron its on ubuntu
           

        except Exception as e:
            print("error")
            # print(traceback.format_exc())  # Print exception details
            # You can add additional error handling logic here

weatherToTables()