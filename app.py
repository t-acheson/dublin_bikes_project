from flask import Flask
app = Flask (__name__, static_url_path = '')

# def connect_to_db():


@app.route('/')
def hello_world():
    #return 'Hello World!'
    return app.send_static_file('index.html')

@app.route('/station_data')
def get_data():
    #connect to db
    #sql query to get station data
    # save it to a json
    return 'json file'
    return app.send_static_file('index.html')
if __name__ == '__main__':
    app.run (debug = True)