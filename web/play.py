import pickle
import pandas as pd

def predict(stationid, temp_c, wind_mph, precip_mm, hours):

    filename = f'./web/mlModel/model_{stationid}.pkl' # Replaces {station} with the actual station ID
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
    predicted_bikes_list = predicted_bikes[0].tolist()
    

    return {"availability" : predicted_bikes_list[0]}

pred = predict(1, 15, 10, 1, 12)

print(pred)