import time
from flask import Flask, request
from flask import jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth, db
import pyrebase
import json
from flask_cors import CORS
import uuid
from datetime import date, datetime
import atexit
from apscheduler.schedulers.background import BackgroundScheduler

# initalise app
app = Flask(__name__)
CORS(app, supports_credentials=True)

# connect to firebase
cred = credentials.Certificate('./backend/recruitassistant_cred.json')
firebase = firebase_admin.initialize_app(cred, {"databaseURL": "https://recruitassistant-fe71e.firebaseio.com", "storageBucket": "gs://recruitassistant-fe71e.appspot.com"})
pb = pyrebase.initialize_app(json.load(open('./backend/firebase_config.json')))
storage = pb.storage()
ref = db.reference('/')

def print_date_time():
    print(time.strftime("%A, %d. %B %Y %I:%M:%S %p"))

def check_postings():
	posts=ref.child("jobAdvert").get()
	for key in posts.keys():
		#if current datetime has exceeded closing date, close the thing
		close_date = datetime.strptime(posts[key]["closing_date"], "%Y-%m-%d")
		current_date = datetime.now()
		delta = close_date - current_date

		try:
			if(delta.days < 0 and posts[key]["status"] == "open"):
				ref.child("jobAdvert").update({
					key:{
						'title': posts[key]["title"],
						'location': posts[key]["location"],
						'company': posts[key]["company"],
						'date_posted': posts[key]["date_posted"],
						'description': posts[key]["description"],
						'closing_date': posts[key]["closing_date"],
						'recruiter_id': posts[key]["recruiter_id"],
						'job_type': posts[key]["job_type"],
						'req_qualifications':posts[key]["req_qualifications"],
						'salary_pa': posts[key]["salary_pa"],
						'experience_level': posts[key]["experience_level"],
						'required_docs': posts[key]["required_docs"],
						'status': "closed",
						'additional_questions': posts[key]["additional_questions"],
						'responsibilities': posts[key]["responsibilities"]
					}
				})
		except:
			print("failed to update for some reason")

scheduler = BackgroundScheduler()
scheduler.add_job(func=check_postings, trigger="interval", seconds=5)
scheduler.start()
# atexit.register(lambda: scheduler.shutdown())

@app.route('/auth', methods=["POST"])
def check_token():
	data = request.json
	try:
		user = auth.verify_id_token(data["token"])
		user_uid = user["uid"]
		print(data["token"])
		# print(user_uid)
		user_info = ref.child('user').order_by_key().equal_to(user_uid).get()[user_uid]
		print("---user info ---" + str(user_info))
		return jsonify({'message': 'Successfully verified', 'uid': user_uid, 'user_info': user_info}),200
	except Exception as e:
		print(e)
		return jsonify({'message': 'Token verification failed'}),400

@app.route('/upload', methods=["POST"])
def check_files():
	print(request.files.to_dict())
	jobid = request.args.get('job_id')
	jobseekerid = request.args.get('jobseeker_id')
	try:
		for key, val in request.files.items():
			uploadTask = storage.child(jobid + "_" + jobseekerid + "_" + key).put(val)
		return jsonify({'message': 'Uploaded files successfully'}),200
	except Exception as e:		
		return jsonify({"message": str(e)}), 400

@app.route('/jobapplications', methods=["POST"])
def post_application():
	#posts job application to database
	json_data = request.get_json()
	# print(json_data)
	application_uid=str(uuid.uuid1())
	# print(application_uid)
	today = date.today()
	date_posted = today.strftime("%Y-%m-%y")
	# print("d1 =", date_posted)

	try:
		ref.child('jobApplications').child(json_data["job_id"]).update({
				application_uid: {
					'first_name': json_data["first_name"],
					'last_name' : json_data["last_name"],
					'phone_number': json_data['phone_number'],
					'rights':json_data["rights"],
					'date_posted': date_posted,
					'qualifications':json_data["qualifications"],
					'jobseeker_id':json_data["jobseeker_id"],
					# 'job_id':json_data["job_id"],
					#'required_docs': json_data["required_docs"],
				},
			})
		return jsonify({'message': f'Successfully created application {application_uid}'}),200
	except Exception as e:		
		return jsonify({"message": str(e)}), 400

@app.route('/jobapplications', methods=["GET"])
def check_applied():
	#checks if application exists for jobseeker and job
	try:
		jobid = request.args.get('job_id')
		jobseekerid = request.args.get('jobseeker_id')
		jobseeker_applications=ref.child("jobApplications").order_by_child('jobseeker_id').equal_to(jobseekerid).get()

		for key,val in jobseeker_applications.items():
			if val['job_id'] == jobid:
				print("Has applied before")
				return jsonify({'applied': True}),200
		
		print("Hasn't applied before")
		return jsonify({'applied': False}),200
 
	except Exception as e:		
		print(e)
		return jsonify({"message": str(e)}), 400

# test
@app.route('/time')
def get_current_time():
	data = {'time': 10000}
	return jsonify(data)

@app.route('/jobadverts', methods=["POST"])
def post_new_job():
	json_data = request.get_json()
	job_uid=str(uuid.uuid1())
	print(job_uid)
	print( json_data['closing_date'])
	today = date.today()
	date_posted = today.strftime("%Y-%m-%y")
	print("d1 =", date_posted),
	#TODO
	#add recruiter_id as id of logged in user
	
	try:
		ref.child('jobAdvert').update({
				job_uid: {
					'title':json_data["title"],
					'location':json_data["location"],
					'description': json_data['description'],
					'company':json_data["company"],
					'date_posted': date_posted,
					'closing_date':json_data["closing_date"],
					'recruiter_id':json_data["recruiter_id"],
					'job_type': json_data["job_type"],
					'salary_pa':json_data["salary_pa"],
					'experience_level':json_data["experience_level"],
					'req_qualifications':json_data["qualifications"],
					'responsibilities': json_data['responsibilities'],
					'required_docs': json_data["required_docs"],
					#'min_years_experience': json_data["min_years_experience"],
					'status': json_data['status'],
					'additional_questions': json_data['additional_questions']

				},
			})
		return jsonify({'message': f'Successfully created job {job_uid}'}),200
	except Exception as e:		
		return jsonify({"message": str(e)}), 400
		

@app.route('/jobadverts/open', methods=["GET"])
def get_all_posts():
	#gets all posts in the database
	try:
		posts=ref.child("jobAdvert").get()
		
		jobs=[]
		for key,val in posts.items():
			jobs.append((key,val))

		print(jobs)
		return jsonify({'jobs': jobs}),200
 
	except Exception as e:
		return jsonify({"message": str(e)}), 400

@app.route('/jobadverts/<recruiterid>', methods=["GET"])
def get_recruiter_posts(recruiterid):
	#TODO:
	#use recruiter id of logged in user
	#figure out how to also sort results on closing date -> realtime db doesnt 
	#support multiple where clauses unlike firebase cloud db
	
	try:
		posts=ref.child("jobAdvert").order_by_child('recruiter_id').equal_to(recruiterid).get()

		jobs=[]
		for key,val in posts.items():
			jobs.append((key,val))
		
		print(jobs)
		return jsonify({'jobs': jobs}),200
 
	except Exception as e:		
		print(e)
		return jsonify({"message": str(e)}), 400
		
@app.route('/advertisement', methods=["GET"])
def get_job_for_page():
	#gets job from job id
	try:
		jobid = request.args.get('job_id')
		post = ref.child("jobAdvert").order_by_key().equal_to(jobid).get()

		job=[]
		for key,val in post.items():
			job.append((key,val))
		
		print(job)
		return jsonify({'job': job}),200
 
	except Exception as e:		
		print(e)
		return jsonify({"message": str(e)}), 400

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
		# userID = list(data.val().items())[0][0]
		user = list(data.val().items())[0][1]

		# return jsonify({"token": token, "user": user, "userID": userID}), 200
		return jsonify({"token": token, "type": user["type"]}), 200

	except Exception as e:
		error_message = json.loads(e.args[1])['error']['message']
		error_code = json.loads(e.args[1])['error']['code']
		
		return jsonify({"message": error_message}), error_code


