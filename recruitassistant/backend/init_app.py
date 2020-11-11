from flask import Flask
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth, db
import pyrebase
import json

# initalise app
app = Flask(__name__)
CORS(app, supports_credentials=True)

# connect to firebase
#cred = credentials.Certificate('./backend/recruitassistant_cred.json')
cred = credentials.Certificate('./backend/recruitassistant_cred2.json')
#firebase = firebase_admin.initialize_app(cred, {"databaseURL": "https://recruitassistant-fe71e.firebaseio.com"})
firebase = firebase_admin.initialize_app(cred, {"databaseURL": "https://recruitassistant-v2.firebaseio.com"})
pb = pyrebase.initialize_app(json.load(open('./backend/firebase_config2.json')))
#pb = pyrebase.initialize_app(json.load(open('./backend/firebase_config.json')))
ref = db.reference('/')