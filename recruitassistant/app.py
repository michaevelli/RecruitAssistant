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
		# set information for users i.e. fullname, company etc.
		# currently with temp data
		users_ref = ref.child('jobseeker')
		users_ref.set({
			user.uid: {
				'date_of_birth': 'I AM TEMP DATA',
				'full_name': 'I AM TEMP DATA'
			},
		})

		# if data["type"] == "user":
		#     users_ref = ref.child('jobseeker')
		#     users_ref.set({
		#         user.uid: {
		#             'full_name': data["full_name"],
		#         },
		#     })
		# else:
		#     users_ref = ref.child('recruiter')
		#     users_ref.set({
		#         user.uid: {
		#             'full_name': data["full_name"],
		#             'company': data["company"]
		#         },
			
		return jsonify({'message': f'Successfully created user {user.uid}'}),200
	except:
		return jsonify({'message': 'Error creating user'}),400

# @app.route('/login', methods=['POST'])
@app.route('/login')
def login():
	try:
		fAuth = pb.auth()
		
		# password = request.form.get("password")
    # email = request.form.get("email")
		password = 'password1234'
		email = 'a@a.com'

		user = fAuth.sign_in_with_email_and_password(email, password)
		user = fAuth.refresh(user['refreshToken'])

		return jsonify({"success": True, "token": user['idToken']}), 200
	except:
		return jsonify({'message': 'Failed login'}), 400
