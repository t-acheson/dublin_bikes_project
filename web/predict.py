import pickle
import numpy as np
import pandas as pd
import sys 
import sklearn
import os
from flask import jsonify


def predict(stationid, temp_c, wind_mph, precip_mm, hours):

    filename = f'.dublin_bikes_project/web/mlModel/model_{stationid}.pkl' # Replaces {station} with the actual station ID
    with open(filename, 'rb') as file:
        model = pickle.load(file)

    df_prediction = pd.DataFrame({
        'temp_c': [temp_c], 
        'wind_mph': [wind_mph],
        'precip_mm': [precip_mm],
        'hours': [hours] 
    })

    # Predict the number of available bikes
    predicted_bikes = model.predict(df_prediction)
# Convert the NumPy array to a Python list
    predicted_bikes = model.predict(df_prediction)
# Convert the NumPy array to a Python list
    predicted_bikes_list = predicted_bikes[0].tolist()
    

    return jsonify({"availability" : predicted_bikes_list[0]})