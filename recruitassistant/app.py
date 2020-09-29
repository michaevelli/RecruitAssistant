import time
from flask import Flask
from flask import jsonify 

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    data = {'time': 10000}
    return jsonify(data)