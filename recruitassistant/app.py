import time
from flask import Flask
from flask import jsonify 
import firebase_admin
from firebase_admin import db


app = Flask(__name__)

firebase_admin.initialize_app(options={
    'databaseURL': 'https://recruitassistant-fe71e.firebaseio.com/'
})
RADB = db.reference('recruitassistant')


@app.route('/time')
def get_current_time():
    data = {'time': 10000}
    return jsonify(data)

@app.route('/testlogin')
def test_login():
    data = {'username': 'hi'}
    d1 = RADB.push(req)
    return flask.jsonify({'id': d1.key}), 201

