import os
import pyrebase

# firebaseConfig = {
#     "apiKey": "AIzaSyDDm3yZZWt1PTFBwJ6RsH_DTL_P8zZIgF4",
#     "authDomain": "recruitassistant-fe71e.firebaseapp.com",
#     "databaseURL": "https://recruitassistant-fe71e.firebaseio.com",
#     "projectId": "recruitassistant-fe71e",
#     "storageBucket": "recruitassistant-fe71e.appspot.com",
#     "messagingSenderId": "827071966465",
#     "appId": "1:827071966465:web:7b2de65ce25425a5c93f00"
#   }

firebaseConfig2 = {
    "apiKey": "AIzaSyCz63auke4l0tRlhIjJBH8jHtbOKuj63EU",
    "authDomain": "recruitassistant-v2.firebaseapp.com",
    "databaseURL": "https://recruitassistant-v2.firebaseio.com",
    "projectId": "recruitassistant-v2",
    "storageBucket": "recruitassistant-v2.appspot.com",
    "messagingSenderId": "508128916024",
    "appId": "1:508128916024:web:332e32d9d37099e30c6ccd"
}

# firebase = pyrebase.initalize_app(firebaseConfig)
firebase = pyrebase.initalize_app(firebaseConfig2)


fireAuth = firebase.auth()
db = firebase.database()