#import stuff
import requests
import json
from pprint import pprint 


NAME = "Dublin" #name of contract
STATIONS = "https://api.jcdecaux.com/vls/v1/stations?"
APIKEY = "9923c4b16f8c5fd842f2f448564bed43a349fa47"

def bikesToTables():
    while True:
        try:
            r = requests.get(STATIONS, params={"apiKey": APIKEY, "contract": NAME})

            store(json.loads(r.test))

            #sleep for 5 mins
            time.sleep(5*60)

        except:
            print traceback.format_exc()
        return 
#step 1 request data from api 
GET https://api.jcdecaux.com/vls/v1/stations?contract={dublin}&apiKey={9923c4b16f8c5fd842f2f448564bed43a349fa47}
Accept: application/json

# r = requests.get(STATIONS_URI, params={"apiKey": dbinfo.JCKEY,"contract": NAME})
# json.loads(r.text)

#step 2 parse data into json if not already

#step 3 connect to sql database

#step 4 insert data into the database
cursor = conn.cursor() #to make sql commands work i believe? 
#make table for station number 
#sql statememt to insert into table 
#try, exepct

#step 5 commit transaction?

#step 6 close connect 
conn.close()