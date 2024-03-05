import mysql.connector

# Replace these with your actual database credentials
db_config = mysql.connector.connect(
                host = "dublinbikes20.c9g2qa8qkqxt.eu-north-1.rds.amazonaws.com",
                database = "dublinbikesgroup20",
                user = "admin",
                password = "dublinbikesgroup20",
)

try:
    # Attempt to connect to the database
    connection = mysql.connector.connect(**db_config)
    print("Database connection successful")

    # Close the connection
    connection.close()

except Exception as e:
    print(f"Error connecting to the database: {e}")
