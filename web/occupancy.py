import json
from datetime import datetime
import sys

def calculate_hourly_averages(data):
# Dictionary to store hourly averages
    hourly_averages = {}

    # Iterate through data
    for entry in data:
        # Convert Unix timestamp to datetime object
        dt_object = datetime.fromtimestamp(entry['last_update'])
        
        # Extract day and hour
        day = dt_object.strftime('%Y-%m-%d')
        hour = dt_object.hour
        
        # Initialize dictionary for the day if not exists
        if day not in hourly_averages:
            hourly_averages[day] = {}
        
        # Initialize list for the hour if not exists
        if hour not in hourly_averages[day]:
            hourly_averages[day][hour] = {'total_bikes': 0, 'total_stands': 0, 'count': 0}
        
        # Add available bikes and stands to totals
        hourly_averages[day][hour]['total_bikes'] += entry['available_bikes']
        hourly_averages[day][hour]['total_stands'] += entry['available_bike_stands']
        hourly_averages[day][hour]['count'] += 1

    # Calculate average for each hour of each day
    for day, hours_data in hourly_averages.items():
        for hour, hour_data in hours_data.items():
            average_bikes = hour_data['total_bikes'] / hour_data['count']
            average_stands = hour_data['total_stands'] / hour_data['count']
            print(f"On {day}, hour {hour}: Average bikes: {average_bikes}, Average stands: {average_stands}")


if __name__ == "__main__":
    # Read JSON data from stdin
    json_data = sys.stdin.read()

    # Parse JSON data
    try:
        data = json.loads(json_data)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}", file=sys.stderr)
        sys.exit(1)

    # Calculate hourly averages
    calculate_hourly_averages(data)