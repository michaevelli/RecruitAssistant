import time
from flask import Flask, request
from flask import jsonify
# from flask_cors import CORS
# import firebase_admin
# from firebase_admin import credentials, auth, db
from firebase_admin import auth
import json
import uuid
from datetime import date, datetime
import atexit
from apscheduler.schedulers.background import BackgroundScheduler
from backend import jobs, search, authentication, offer,notifications, counteroffer, admin
from backend.init_app import app, ref, pb

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
			elif(delta.days > 0 and posts[key]["status"] == "closed"):
				ref.child("jobAdvert").child(key).child("status").set("open")
		except:
			print("failed to update for some reason")
			print(key)

scheduler = BackgroundScheduler()
scheduler.add_job(func=check_postings, trigger="interval", seconds=5)
scheduler.start()
# atexit.register(lambda: scheduler.shutdown())


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
					'jobseeker_id':json_data["jobseeker_id"],
					'status': "active" # status can be active or dismissed
				},
			})
		return jsonify({'message': f'Successfully created application {application_uid}'}),200
	except Exception as e:		
		return jsonify({"message": str(e)}), 400

# updates status of application to dismissed
@app.route('/dismiss', methods=["PATCH"])
def dismiss_application():
	try:
		json_data = request.get_json()
		job_id = json_data["job_id"]
		application_id =json_data["app_id"]
		ref.child("jobApplications").child(job_id).child(application_id).child("status").set("dismissed")
		return jsonify({'message': f'Dismissed application {application_id}'}),200
	except Exception as e:
		print(e)
		return jsonify({"message": str(e)}), 400
	return

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
		
		#print("Hasn't applied before")
		return jsonify({'applied': False}),200
 
	except Exception as e:		
		print(e)
		return jsonify({"message": str(e)}), 400


# get job app only
@app.route('/jobapplication', methods=["GET"])
def get_app_details():
	#checks if application exists for jobseeker and job
	try:
		job_id=request.args.get('jobId')
		job_app_id = request.args.get('jobAppId')
		specific_child="jobApplications/"+job_id+'/'+job_app_id
		#print(specific_child)
		the_application=ref.child(specific_child).get()
		# print("THE APPP")
		#print(the_application)
		return jsonify({'application': the_application}),200
 
	except Exception as e:
		print(e)
		return jsonify({"message": str(e)}), 400		

#get job app and job advert
@app.route('/retrieveapplication', methods=["GET"])
def return_application():
	appid = request.args.get('app_id')
	jobid = request.args.get('job_id')
	app_resp = {}
	#print("here")
	try:
		app_resp=ref.child("jobApplications").get().get(jobid).get(appid)
		#print(app_resp)
		job_info = ref.child("jobAdvert").order_by_key().equal_to(jobid).get().get(jobid)
		#print(job_info)

		return jsonify({"applications": app_resp, "jobinfo": job_info}), 200
	except Exception as e:
		print(e)
		return jsonify({"message": str(e)}), 400


# test
@app.route('/time')
def get_current_time():
	data = {'time': 10000}
	return jsonify(data)
		

@app.route('/jobadverts/open', methods=["GET"])
def get_all_posts():
	#gets all posts in the database
	try:
		posts=ref.child("jobAdvert").get()
		
		jobs=[]
		for key,val in posts.items():
			jobs.append((key,val))

		#print(jobs)
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
		
		#print(jobs)
		return jsonify({'jobs': jobs}),200
 
	except Exception as e:		
		print(e)
		return jsonify({"message": str(e)}), 400

#update the status of an interview
@app.route('/interviews', methods=["PATCH"])
def update_interview():
	try:
		json_data = request.get_json()
		interview_id =json_data["id"]
		new_status=json_data["status"]

		# notification to recruiter
		job_id = ref.child("interviews").child(interview_id).child("job_id").get()
		status_lower = new_status.lower()
		notif_data = {
					"uid": ref.child("interviews").child(interview_id).child("employer_id").get(),
					"obj_id": interview_id,
					"type" : f"{status_lower} interview",
					"url" : f"http://localhost:3000/interviews/{job_id}",
				}
		notifications.notify(notif_data)

		ref.child("interviews").child(interview_id).child("status").set(new_status)
		return jsonify({'message': f'Successfully updated interview {interview_id}'}),200
	except Exception as e:
		print(e)
		return jsonify({"message": str(e)}), 400
	return

#get details of just one interview
@app.route('/interviews/<interviewid>', methods=["GET"])
def get_specific_interview(interviewid):
	try:
		json_data = request.get_json()
		interview=ref.child("interviews").child(interviewid).get()	
		return jsonify({'interview': interview}),200
	except Exception as e:
		print(e)
		return jsonify({"message": str(e)}), 400
	return


@app.route('/interviews', methods=["POST"])
def send_interview():
	json_data = request.get_json()
	invite_list = json_data["invite_list"]
	# interview_id=str(uuid.uuid1())
	i = 0
	try:
		for u in invite_list:
			interview_id=str(uuid.uuid1()) + str(i)
			
			notif_data = {
				"uid": u["jobseeker_id"],
				"obj_id": interview_id,
				"type" : "interview",
				"url" : f"http://localhost:3000/interview/{interview_id}",
			}
			notifications.notify(notif_data)

			ref.child('interviews').update({
					interview_id: {
						'jobseeker_id': u["jobseeker_id"],
						'employer_id': u["employer_id"],
						'application_id': u["app_id"],
						'job_id': u["job_id"],
						'first_name': u["first_name"],
						'last_name': u["last_name"],
						'interview_date': u["date"],
						'interview_time': u["time"],
						'status': "pending"
					},
				})
		return jsonify({'message': f'Successfully created interview {interview_id}'}),200
	except Exception as e:
		print(e)
		return jsonify({"message": str(e)}), 400
	return

# gets a sorted list of applications for a job
@app.route('/applicationslist', methods=["GET"])
def get_applications_for_job():
	try:
		jobid = request.args.get('job_id')
		post = ref.child('jobApplications').order_by_key().equal_to(jobid).get()
		applications=[]
		# print(list(post.items().index("qualities_met")))
		for key,val in post.items():
			# print(key)
			# sort on how many qualifications are met
			sortedApps = sorted(val, reverse = True, key = lambda x :val.get(x).get('qualities_met'))
			for appid in sortedApps:
				if val.get(appid).get('status') == "active":
			 		applications.append((appid, val.get(appid)))
		
		#print(applications)
		return jsonify({'applications': applications}),200
 
	except Exception as e:		
		print(e)
		return jsonify({"message": str(e)}), 400

# gets a list of interviews for a job
@app.route('/interviewslist', methods=["GET"])
def get_interviews_for_job():
	try:
		jobid = request.args.get('job_id')
		post = ref.child('interviews').order_by_child('job_id').equal_to(jobid).get()
		interviews = []
		for key,val in post.items():
			interviews.append((key, val))
		
		# print(interviews)
		return jsonify({'interviews': interviews}),200
 
	except Exception as e:		
		print(e)
		return jsonify({"message": str(e)}), 400


@app.route('/interviewlist', methods=['POST'])
def getInterviews():
	try:
		data = request.json
		user = auth.verify_id_token(data["token"])
		uid = user["uid"]

		interviews = []
		posts=ref.child("interviews").get()	
		for key, val in posts.items():
			interviewDatetime = val["interview_date"] + " " + val["interview_time"]
			current_date = datetime.now()
			close_date = datetime.strptime(interviewDatetime, "%Y-%m-%d %H:%M")
			delta = close_date - current_date
			if delta.days < 0:
				continue
			print(interviewDatetime)
			if val["jobseeker_id"] == uid:
				jobId = val["job_id"]
				job = ref.child("jobAdvert").order_by_key().equal_to(jobId).get()
				for jkey, jval in job.items():
					interviews.append((key, val, jkey, jval))

		return jsonify({'interviews': interviews}), 200
	except Exception as e:
		print(e)
		return jsonify({"error": "something bad happened"}),500

@app.route('/pendingapplications', methods=['POST'])
def getApplications():
	try:
		data = request.json
		user = auth.verify_id_token(data["token"])
		uid = user["uid"]

		applications = []
		posts=ref.child("jobApplications").get()	
		for key, val in posts.items():
			for key2, val2 in val.items():
				if val2["jobseeker_id"] == uid:
					job = ref.child("jobAdvert").order_by_key().equal_to(key).get()
					for jkey, jval in job.items():
						applications.append((key2, val2, jkey, jval))
		

		return jsonify({'applications': applications}), 200
	except Exception as e:
		print(e)
		return jsonify({"error": "something bad happened"}),500

