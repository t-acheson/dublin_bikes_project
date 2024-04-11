import pickle
import numpy as np
import pandas as pd
import sys 
import sklearn
import os
from flask import jsonify

# Get the list of all directories in the current folder
directories = [d for d in os.listdir('./')]
print("jere", file = sys.stdout)
# Print the list of directories
for directory in directories:
    print(directory, file = sys.stdout)

def predict(stationid, temp_c, wind_mph, precip_mm, hours):
    # station = 2
    # Load the model

    filename = f'./mlModel/model_{stationid}.pkl' # Replaces {station} with the actual station ID
    with open(filename, 'rb') as file:
        model = pickle.load(file)

    # Prepare the input data for prediction
    # Assuming you have a DataFrame df_prediction with the same columns as X_train
    # For example, let's say you want to predict for a specific hour
    df_prediction = pd.DataFrame({
        'temp_c': [temp_c], # Example temperature
        'wind_mph': [wind_mph], # Example wind speed
        'precip_mm': [precip_mm], # Example precipitation
        'hours': [hours] # Example hour
    })

    # Predict the number of available bikes
    predicted_bikes = model.predict(df_prediction)
# Convert the NumPy array to a Python list
    # predicted_bikes_list = predicted_bikes.tolist()
    

    return jsonify(data={'avail': predicted_bikes[0]})