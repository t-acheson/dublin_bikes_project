from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from datetime import datetime
import functools

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://admin:dublinbikesgroup20@dublinbikes20.c9g2qa8qkqxt.eu-north-1.rds.amazonaws.com/dublinbikesgroup20'

db = SQLAlchemy(app)

def connect_to_db():
    return db

@app.route("/stations")
@functools.lru_cache(maxsize=128)
def get_stations():
    #Establish a database connection
    database = connect_to_db()

    # Define the SQL query
    query = "SELECT * FROM station;"

    try:
        # Execute the query and fetch all rows
        with database.connect() as connection:
            result = connection.execute(text(query))
            stations_data = [dict(row) for row in result.fetchall()]

        # Return the station data as JSON
        return jsonify(stations_data)

    except Exception as e:
        print(f"Error in get_stations: {e}")
        return "An error occurred while fetching stations data"

if __name__ == "__main__":
    app.run(debug=True)