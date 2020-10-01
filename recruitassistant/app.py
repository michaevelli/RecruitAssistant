import time
from flask import Flask, request
from flask import jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth, db
import pyrebase
import json

# initalise app
app = Flask(__name__)
CORS(app, supports_credentials=True)

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

#@app.route('/api/signup', methods=["POST"])
@app.route('/api/signup')
def seeker_signup():
    email = request.form.get('email')
    password = request.form.get('password')

    #data = request.json
    #email = data["email"]
    #password = data["password"]

    # frontend 
    # type: (admin/user/recruiter)
    
    if email is None or password is None:
        return jsonify({'message': 'Error missing email or password'}),400
    try:
        user = auth.create_user(
                email=email,
                password=password
        )
        # data structure
        # currently with temp data
        users_ref = ref.child('user')
        users_ref.update({
            user.uid: {
                'first_name': 'I AM TEMP DATA',
                'last_name' : 'I AM TEMP DATA',
                'company' : 'null/filled',
                'email' : 'test@a.com',
                'type' : 'JobSeeker/Recruiter'
            },
        })
                  
        return jsonify({'message': f'Successfully created user {user.uid}'}),200
    except:
        return jsonify({'message': 'Error creating user'}),400

@app.route('/login', methods=['POST'])
# @app.route('/login')
def login():
	try:
		fAuth = pb.auth()
		db = pb.database()
		
		datajson = request.json
		password = datajson["password"]
		email = datajson["email"]
		# password = 'hello123'
		# email = 'hello@gmail.com'
		print(email, password)

		# login with email password
		response = fAuth.sign_in_with_email_and_password(email, password)
		token = fAuth.refresh(response['refreshToken'])['idToken']

		# retrieve user data
		data = db.child("user").order_by_child("email").equal_to(email).get()
		user = list(data.val().items())[0][1]

		return jsonify({"success": True, "token": token, "user": user}), 200

	except Exception as e:
		return jsonify({"success": False, "token" : "Email or password inserted is incorrect"}), 401