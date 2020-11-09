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
from backend import jobs, search,interviews, authentication, offer,notifications, counteroffer
from backend.init_app import app, ref, pb

def print_date_time():
    print(time.strftime("%A, %d. %B %Y %I:%M:%S %p"))

def check_postings():
	posts=ref.child("jobAdvert").get()
	for key in posts.keys():
		#if current datetime has exceeded closing date, close the thing
		try:
			close_date = datetime.strptime(posts[key]["closing_date"], "%Y-%m-%d")
			current_date = datetime.now()
			delta = close_date - current_date
		
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
					'status': "pending" # status can be active or dismissed
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





# gets a sorted list of applications for a job
@app.route('/applicationslist', methods=["GET"])
def get_applications_for_job():
	try:
		jobid = request.args.get('job_id')
		post = ref.child('jobApplications').order_by_key().equal_to(jobid).get()
		applications=[]
		# print(list(post.items().index("qualities_met")))
		for key,val in post.items():
			# sort on how many qualifications are met
			sortedApps = sorted(val, reverse = True, key = lambda x :val.get(x).get('qualities_met'))
			for appid in sortedApps:
				if val.get(appid).get('status') == "pending":
			 		applications.append((appid, val.get(appid)))
		
		#print(applications)
		return jsonify({'applications': applications}),200
 
	except Exception as e:		
		print(e)
		return jsonify({"message": str(e)}), 400


#TODO this function is really slow (on localhost:3000/offers applications tab)
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

