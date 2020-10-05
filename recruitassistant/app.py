import time
from flask import Flask, request
from flask import jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth, db
import pyrebase
import json
from flask_cors import CORS

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

@app.route('/signup', methods=["POST"])
def user_signup():
	json_data = request.get_json()
	email = json_data["email"]
	password = json_data["password"]
	u_type = json_data["type"]
	if u_type == "jobseeker":
		company = "null"
	else:
		company = json_data["company"]

	print(json_data)
    
	if email is None or password is None:
		return jsonify({'message': 'Error missing email or password'}),400
	try:
		user = auth.create_user(
				email=email,
				password=password
		)
		users_ref = ref.child('user')

		users_ref.update({
			user.uid: {
				'first_name': json_data["first_name"],
				'last_name' : json_data["last_name"],
				'email' : email,
				'type' : u_type,
				'company' : company,
			},
		})

		return jsonify({'message': 'Successfully created user {user.uid}'}),200
	except Exception as e:		
		return jsonify({"message": str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
	try:
		json_data = request.get_json()

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

		return jsonify({"token": token, "user": user}), 200

	except Exception as e:
		error_message = json.loads(e.args[1])['error']['message']
		error_code = json.loads(e.args[1])['error']['code']
		
		return jsonify({"message": error_message}), error_code

