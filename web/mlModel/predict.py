import pickle
import pandas as pd 

def predict(stationid, temp_c, wind_mph, precip_mm, hours):
    # station = 2
    # Load the model
    filename = f'model_{stationid}.pkl' # Replace {station} with the actual station ID
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

    print(f"Predicted number of available bikes: {predicted_bikes[0]}")
    return predicted_bikes