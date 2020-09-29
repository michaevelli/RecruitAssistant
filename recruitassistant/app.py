import time
from flask import Flask, request
from flask import jsonify 
import firebase_admin
from firebase_admin import credentials, auth
import pyrebase
import json

app = Flask(__name__)

# connect to firebase
cred = credentials.Certificate('./backend/recruitassistant_cred.json')
firebase = firebase_admin.initialize_app(cred)
pb = pyrebase.initialize_app(json.load(open('./backend/firebase_config.json')))

# test
@app.route('/time')
def get_current_time():
    data = {'time': 10000}
    return jsonify(data)

@app.route('/api/seeker_signup')
def seeker_signup():
    #fullname = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')
    if email is None or password is None:
        return jsonify({'message': 'Error missing email or password'}),400
    try:
        user = auth.create_user(
                #fullname=fullname,
                email=email,
                password=password
        )
        return jsonify({'message': f'Successfully created user {user.uid}'}),200
    except:
        return jsonify({'message': 'Error creating user'}),400

@app.route('/api/recruiter_signup')
def recruiter_signup():
    fullname = request.form.get('name')
    company = request.form.get('company_name')
    email = request.form.get('email')
    password = request.form.get('password')
    if fullname is None or email is None or password is None:
        return jsonify({'message': 'Error missing email or password'}),400
    try:
        user = auth.create_user(
                type="recruiter",
                fullname=fullname,
                company=company,
                email=email,
                password=password
        )
        return jsonify({'message': f'Successfully created recruiter {user.uid}'}),200
    except:
        return jsonify({'message': 'Error creating recruiter'}),400
