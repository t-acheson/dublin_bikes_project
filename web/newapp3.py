from db_config import Base
from jcDecaux_info import Station, Availability
from weather_info import Weather
from flask import Flask, g, jsonify, render_template
from sqlalchemy import create_engine, func, Column, String, Integer, Double, Boolean
from sqlalchemy.orm import sessionmaker, joinedload
import functools
import json
import sys

app = Flask(__name__, static_url_path='')

# Get the db_info
with open('./static/dbinfo.json') as f:
    db_info = json.load(f)

USER = 
PASSWORD = 
URI = 
PORT = 
DB = 

# Create a new session
engine = create_engine(
    'mysql+pymysql://{}:{}@localhost:{}/{}'.format(USER, PASSWORD, PORT, DB), echo=True)
print(engine.url)
Base.metadata.create_all(bind=engine)
Session = sessionmaker(bind=engine)
session = Session()
print("connected")

# Gives all of the data needed for the home page

@app.route("/home/")
def get_all_stations():
    # Station ID, Name, longitude, latitude
    # Weather data
    # Station availability
    data = {"stations": {},
            "weather": {}}
    rows = session.query(Availability).filter(
        Availability.time_updated == func.max(Availability.time_updated).select())
    for row in rows:
        print(type(row.station_id), file=sys.stdout)
        data["stations"][row.station_id] = "1"
        data2.append(row.available_bikes)
        print(row.station_id)
        print(row.available_bikes)
        print(row.available_bike_stands)
        print(row.time_updated)
    print(data, file=sys.stdout)
    print(data2, file=sys.stdout)
    row = session.query(Station).all()

    return jsonify(rows)


#Joins stations tables to give static data and latest dynamic data
@app.route("/stations/")
def get_stations():
    #subquery to find latest data in availability
    latest_dynamic_data = session.query(func.max(Availability.time_updated)).scalar_subquery()

    station_data = session.query(Station, Availability).\
        join(Availability, Station.station_id == Availability.station_id).\
        filter(Availability.time_updated == latest_dynamic_data).all()

    data = []

    for station, availability in station_data:
        station_data = {
            'station_id': station.station_id,
            'name': station.name,
            'latitude': station.latitude,
            'longitude': station.longitude,
            'payment_terminal': station.payment_terminal,
            'total_bike_stands': availability.bike_stands,
            'available_bikes': availability.available_bikes,
            'available_bike_stands': availability.available_bike_stands,
            'time_updated': availability.time_updated
        }
        data.append(station_data)
    return jsonify(data)

# @app.route("/available/<int:station_id>")
# def get_stations(station_id):
#     row = session.query(Availability).filter_by(station_id=station_id)
#     return jsonify(row)


@app.route('/')
def root():
    data = []
    rows = session.query(Station).all()
    for row in rows:
        data.append(row.station_id)
    #Changed to render_template as we will be importing data and I was getting errors.
    return render_template('index.html', data=data, mapsAPIKey=db_info['mapsAPIKey']) 

if __name__ == "__main__":
    app.run(debug=True)
    print("Done", file=sys.stdout)