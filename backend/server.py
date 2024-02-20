import requests
import json
from bikesinfo import BikesConfig
from WeatherInfo import WeatherConfig

#fetching live bikes data using jcdeaux API
bikes_data= requests.get(BikesConfig.URI)
json.loads(bikes_data.text)

#fetching live weather data using Weather API
#TODO: give latitude and longitude as parameters in API
weather_data=  requests.get(WeatherConfig.URI, params={"key":WeatherConfig.API_KEY, "q":WeatherConfig.Q})
json.loads(weather_data.text)

#storing the fetched data in mysql


