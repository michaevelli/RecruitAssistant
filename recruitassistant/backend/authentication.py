from flask import Flask, request, jsonify
from firebase_admin import auth
from .init_app import app, ref, pb
import json
# check validity of token and return user info
@app.route('/auth', methods=["POST"])
def check_token():
	data = request.json
	try:
		user = auth.verify_id_token(data["token"])
		user_uid = user["uid"]
		user_info = ref.child('user').order_by_key().equal_to(user_uid).get()[user_uid]
		# print("---user info ---" + str(user_info))
		# refresh token
		user = pb.auth().refresh(data['refreshToken'])
		token = user['idToken']
		# print(token)
		return jsonify({'message': 'Successfully verified', 'uid': user_uid, 'user_info': user_info, 'token':token}),200
	except Exception as e:
		print(e)
		return jsonify({'message': 'Token verification failed'}),400

# sign up a new user
@app.route('/signup', methods=["POST"])
def user_signup():
	json_data = request.get_json()
	email = json_data["email"]
	password = json_data["password"]
	u_type = json_data["type"]
	# if u_type == "jobseeker":
	# 	company = "null"
	# else:
	# 	company = json_data["company"]
    
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
				'type' : u_type
			},
		})

		return jsonify({'message': 'Successfully created user {user.uid}'}),200
	except Exception as e:		
		return jsonify({"message": str(e)}), 400

# sign in an existing user
@app.route('/login', methods=['POST'])
def login():
	try:
		fAuth = pb.auth()
		db = pb.database()
		
		datajson = request.json
		password = datajson["password"]
		email = datajson["email"]

		# login with email password
		response = fAuth.sign_in_with_email_and_password(email, password)
		refresh = fAuth.refresh(response['refreshToken'])
		token = refresh['idToken']
		refreshToken = refresh['refreshToken']

		# retrieve user data
		data = db.child("user").order_by_child("email").equal_to(email).get()
		user = list(data.val().items())[0][1]

		return jsonify({"token": token, "refreshToken": refreshToken, "type": user["type"], "name":user["first_name"]}), 200

	except Exception as e:
		print(e)
		error_message = json.loads(e.args[1])['error']['message']
		error_code = json.loads(e.args[1])['error']['code']
		
		return jsonify({"message": "Invalid Email or Password"}), 401