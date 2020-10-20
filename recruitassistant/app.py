import time
from flask import Flask, request
from flask import jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth, db
import pyrebase
import json
import uuid
from datetime import date, datetime
import atexit
from apscheduler.schedulers.background import BackgroundScheduler
from backend import jobs
from backend.init_app import app, ref, pb
import re

# initalise app
# app = Flask(__name__)
# CORS(app, supports_credentials=True)

# # connect to firebase
# cred = credentials.Certificate('./backend/recruitassistant_cred.json')
# firebase = firebase_admin.initialize_app(cred, {"databaseURL": "https://recruitassistant-fe71e.firebaseio.com"})
# pb = pyrebase.initialize_app(json.load(open('./backend/firebase_config.json')))
# ref = db.reference('/')

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
				ref.child("jobAdvert").child(key).child("status").set("closed")
		except:
			print("failed to update for some reason")
			print(key)

scheduler = BackgroundScheduler()
scheduler.add_job(func=check_postings, trigger="interval", seconds=5)
scheduler.start()
# atexit.register(lambda: scheduler.shutdown())

#this method is just for testing download of pdf works
@app.route('/offer', methods=["GET"])
def get_offer_files():
	try:
		posts=ref.child("offer/bc5bd92a-11af-11eb-9fea-005056c00008").child('additional_docs').get()		
		res= posts[0]	
		filename=res['filename']
		content=res['src']
		content=content[28:] #remove data/application blah
		return content,200
 
	except Exception as e:
		return jsonify({"message": str(e)}), 400

@app.route('/offer', methods=["POST"])
def post_offer_letter():
	json_data = request.get_json()
	offer_uid=str(uuid.uuid1())
	
	today = date.today()
	date_posted = today.strftime("%Y-%m-%y")
	print("d1 =", date_posted),
	
	try:
		ref.child('offer').update({
				offer_uid: {
					'title':json_data["title"],
					'location':json_data["location"],
					'description': json_data['description'],
					'company':json_data["company"],
					'date_posted': date_posted,
					'recruiter_id': json_data['recruiter_id'],
					'application_id': json_data['jobapplication_id'],
					'jobseeker_id': json_data['jobseeker_id'],
					'job_type': json_data['job_type'],
					'salary': json_data['salary'],
					'salary_type': json_data['salary_type'],
					'hours': json_data['hours'],
					'days': json_data['days'],
					'start_date': json_data['start_date'],
					'end_date': json_data['end_date'],
					'status': json_data['status'], 
					'additional_docs': json_data['additional_docs'],
				}
			})
		return jsonify({'message': f'Successfully created offer {offer_uid}'}),200
	except Exception as e:		
		return jsonify({"message": str(e)}), 400


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
	storage = pb.storage()
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
					'qualities_met':json_data["qualities_met"],
					'submitted_docs': json_data["submitted_docs"],
					'jobseeker_id':json_data["jobseeker_id"]
					# 'job_id':json_data["job_id"],
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


@app.route('/jobapplication', methods=["GET"])
def get_app_details():
	#checks if application exists for jobseeker and job
	try:
		job_id=request.args.get('jobId')
		job_app_id = request.args.get('jobAppId')
		specific_child="jobApplications/"+job_id+'/'+job_app_id
		print(specific_child)
		the_application=ref.child(specific_child).get()
		print("THE APPP")
		print(the_application)
		return jsonify({'application': the_application}),200
 
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

@app.route('/applicationslist', methods=["GET"])
def get_applications_for_job():
	#gets all posts in the database
	try:
		jobid = request.args.get('job_id')
		post = ref.child("jobApplications").order_by_key().equal_to(jobid).get()
		applications=[]
		# print(list(post.items().index("qualities_met")))
		for key,val in post.items():
			# sort on how many qualifications are met
			sortedApps = sorted(val, reverse = True, key = lambda x :val.get(x).get("qualities_met"))
			sortedRights = sorted(sortedApps, reverse = True, key = lambda x :val.get(x).get("rights"))
			for appid in sortedRights:
			 	applications.append((appid, val.get(appid)))
		
		print(applications)
		return jsonify({'applications': applications}),200
 
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
		# json_data = request.get_json()

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


@app.route('/jobadverts/search', methods=["POST"])
def search():
	try:
		datajson = request.json
		print(datajson)

		search = datajson["search"]
		location = datajson["location"]
		exp = datajson["exp"]
		jobtype = datajson["jobtype"]
		salaryrange = datajson["salaryrange"]

		posts=ref.child("jobAdvert").get()	
		jobs=[]
		for key,val in posts.items():
			# filter: location listed must have location specified
			if location.lower() != "" and not location.lower() in val["location"].lower():
				continue
			# filter: job type asked for must match job type specified
			if jobtype.lower() != "" and not jobtype.lower() == val["job_type"].lower():
				continue
			# filter: experience level asked for must match experience level specified
			if exp.lower() != "" and not exp.lower() == val["experience_level"].lower():
				continue
			# filter: salary specified must fall within the range asked for
			if (int(val["salary_pa"]) < salaryrange[0]) or (int(val["salary_pa"]) > salaryrange[1] and (salaryrange[1] != 200)):
				continue
			
			if search != "":
				searchtext = val["company"].lower() + " " + val["description"].lower() + " " + val["title"].lower()
				searchtext = re.sub(re.compile("\W"), " ", searchtext)
				searchtext = ' '.join([w for w in searchtext.split() if len(w)>3])

				searchqueries = search.lower()
				searchqueries = re.sub(re.compile("\W"), " ", searchqueries)
				for word in searchqueries.split():
					if len(word) <= 3:
						continue
					if word in searchtext:
						jobs.append((key, val))
						break
			else:
				jobs.append((key, val))


		return jsonify({'jobs': jobs}),200
	except Exception as e:
		print(e)
		return jsonify({"error": "something bad happened"}),500
