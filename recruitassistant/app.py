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
from backend import jobs, search, authentication
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
		except:
			print("failed to update for some reason")
			print(key)

scheduler = BackgroundScheduler()
scheduler.add_job(func=check_postings, trigger="interval", seconds=5)
scheduler.start()
# atexit.register(lambda: scheduler.shutdown())


@app.route('/offer', methods=["POST"])
def post_offer_letter():
	json_data = request.get_json()
	offer_uid=str(uuid.uuid1())
	
	today = date.today()
	date_posted = today.strftime("%Y-%m-%y")
	#print("d1 =", date_posted),
	
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

@app.route('/interviews', methods=["POST"])
def send_interview():
	json_data = request.get_json()
	invite_list = json_data["invite_list"]
	# interview_id=str(uuid.uuid1())
	i = 0
	try:
		for u in invite_list:
			interview_id=str(uuid.uuid1()) + str(i)

			ref.child('interviews').update({
					interview_id: {
						'jobseeker_id': u["jobseeker_id"],
						'employer_id': u["employer_id"],
						'application_id': u["app_id"],
						'job_id': u["job_id"],
						'interview_date': u["date"],
						'interview_time': u["time"]
					},
				})
		return jsonify({'message': f'Successfully created interview {interview_id}'}),200
	except Exception as e:
		print(e)
		return jsonify({"message": str(e)}), 400
	return

@app.route('/applicationslist', methods=["GET"])
def get_applications_for_job():
	#gets all posts in the database
	try:
		jobid = request.args.get('job_id')
		post = ref.child("jobApplications").order_by_key().equal_to(jobid).get()
		applications=[]
		# print(list(post.items().index("qualities_met")))
		for key,val in post.items():
			# print(key)
			# sort on how many qualifications are met
			sortedApps = sorted(val, reverse = True, key = lambda x :val.get(x).get("qualities_met"))
			for appid in sortedApps:
			 	applications.append((appid, val.get(appid)))
				#applications.append((key, val.get(appid)))
		
		#print(applications)
		return jsonify({'applications': applications}),200
 
	except Exception as e:		
		print(e)
		return jsonify({"message": str(e)}), 400




@app.route('/offers', methods=['POST'])
def offers():
	try:
		data = request.json
		user = auth.verify_id_token(data["token"])
		uid = user["uid"]

		offers = []
		posts=ref.child("offer").get()	
		jobs=[]
		print(uid)
		#print(posts)
		for key, val in posts.items():
			if val["jobseeker_id"] == uid:
				del val['additional_docs']
				del val['application_id']
				del val['date_posted']
				del val['days']
				del val['description']
				del val['end_date']
				del val['hours']
				del val['jobseeker_id']
				del val['recruiter_id']
				del val['salary']
				del val['salary_type']
				del val['start_date']
				offers.append((key, val))
		

		return jsonify({'offers': offers}), 200
	except Exception as e:
		print(e)
		return jsonify({"error": "something bad happened"}),500

@app.route('/getOfferDetails', methods=['POST'])
def viewOffer():
	try:
		print("OK!")
		offerId = request.json["offerId"]	
		offer = []
		posts=ref.child("offer").get()	
		for key, val in posts.items():
			if key == offerId:
				offer.append((key, val))
		

		return jsonify({'offers': offer}), 200
	except Exception as e:
		print(e)
		return jsonify({"error": "something bad happened"}),500
