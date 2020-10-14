import os
import pyrebase

firebaseConfig = {
    "apiKey": "AIzaSyDDm3yZZWt1PTFBwJ6RsH_DTL_P8zZIgF4",
    "authDomain": "recruitassistant-fe71e.firebaseapp.com",
    "databaseURL": "https://recruitassistant-fe71e.firebaseio.com",
    "projectId": "recruitassistant-fe71e",
    "storageBucket": "recruitassistant-fe71e.appspot.com",
    "messagingSenderId": "827071966465",
    "appId": "1:827071966465:web:7b2de65ce25425a5c93f00"
  }

firebase = pyrebase.initalize_app(firebaseConfig)

fireAuth = firebase.auth()
db = firebase.database()