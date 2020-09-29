import time
from flask import Flask, request
from flask import jsonify 
import firebase_admin
from firebase_admin import credentials, auth, db
import pyrebase
import json

app = Flask(__name__)


# connect to firebase
cred = credentials.Certificate('./backend/recruitassistant_cred.json')
firebase = firebase_admin.initialize_app(cred, {"databaseURL": "https://recruitassistant-fe71e.firebaseio.com"})
pb = pyrebase.initialize_app(json.load(open('./backend/firebase_config.json')))
ref = db.reference('/')


# test
@app.route('/time')
def get_current_time():
    data = {'time': 10000}
    return jsonify(data)

@app.route('/api/signup')
def seeker_signup():
    email = request.form.get('email')
    password = request.form.get('password')

   


    if email is None or password is None:
        return jsonify({'message': 'Error missing email or password'}),400
    try:
        user = auth.create_user(
                email=email,
                password=password
        )
        # set information for users i.e. fullname, company etc.
        # currently with temp data
        users_ref = ref.child('users')
        users_ref.set({
            user.uid: {
                'date_of_birth': 'June 23, 1912',
                'full_name': 'Alan Turing'
            },
        })
        return jsonify({'message': f'Successfully created user {user.uid}'}),200
    except:
        return jsonify({'message': 'Error creating user'}),400

@app.route('/api/login')
def login():
    return 