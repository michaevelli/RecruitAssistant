from flask import Flask, request, jsonify
from datetime import date
from .init_app import app, ref
from backend import notifications
from firebase_admin import auth
from datetime import date, datetime

#TODO comment what is this function doing
@app.route('/interviewlist', methods=['POST'])
def getInterviews():
	try:
		data = request.json
		#TODO pass uid through params instead
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
			# print(interviewDatetime)
			if val["jobseeker_id"] == uid:
				jobId = val["job_id"]
				job = ref.child("jobAdvert").order_by_key().equal_to(jobId).get()
				for jkey, jval in job.items():
					interviews.append((key, val, jkey, jval))

		return jsonify({'interviews': interviews}), 200
	except Exception as e:
		print(e)
		return jsonify({"error": "something bad happened"}),500
	return


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

# gets a list of interviews for a job
@app.route('/interviewslist', methods=["GET"])
def get_interviews_for_job():
	try:
		jobid = request.args.get('job_id')
		post = ref.child('interviews').order_by_child('job_id').equal_to(jobid).get()
		interviews=[]
		for key,val in post.items():
			interviews.append((key, val))
		return jsonify({'interviews': interviews}),200
 
	except Exception as e:		
		print(e)
		return jsonify({"message": str(e)}), 400


# create an a new interview invite for everyone in the invite list
# and notify them
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

			# update application status
			ref.child('jobApplications').child(u['job_id']).child(u['app_id']).child('status').set('interview')
			
		return jsonify({'message': f'Successfully created interview {interview_id}'}),200
	except Exception as e:
		print(e)
		return jsonify({"message": str(e)}), 400
	return
