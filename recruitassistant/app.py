import time
from flask import Flask, request
from flask import jsonify 
import firebase_admin
from firebase_admin import credentials, auth, db
import pyrebase
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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

	print(json_data)
    
	if email is None or password is None:
		return jsonify({'message': 'Error missing email or password'}),400
	try:
		user = auth.create_user(
				email=email,
				password=password
		)
		users_ref = ref.child('user')

		if u_type == "jobseeker":
			users_ref.update({
				user.uid: {
					'first_name': json_data["first_name"],
					'last_name' : json_data["last_name"],
					'email' : email,
					'type' : u_type,
					'company' : 'null',
				},
			})					
		elif u_type == "recruiter":
			users_ref.update({
				user.uid: {
					'first_name': json_data["first_name"],
					'last_name' : json_data["last_name"],
					'email' : email,
					'type' : u_type,
					'company': json_data["company"]
				},
			})

		return jsonify({'message': f'Successfully created user {user.uid}'}),200
	except Exception as e:		
		return jsonify({"message": str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
	try:
		json_data = request.get_json()

		fAuth = pb.auth()
		db = pb.database()
		
		password = json_data["password"]
		email = json_data["email"]
		
		response = fAuth.sign_in_with_email_and_password(email, password)
		token = fAuth.refresh(response['refreshToken'])['idToken']
		user = db.child("user").order_by_child("email").equal_to(email).get().val()

		return jsonify({"success": True, "token": token, "user": user}), 200
	except Exception as e:
		error_message = json.loads(e.args[1])['error']['message']
		error_code = json.loads(e.args[1])['error']['code']
		
		return jsonify({"message": error_message}), error_code
