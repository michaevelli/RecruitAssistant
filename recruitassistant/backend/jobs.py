from flask import Flask, request, jsonify
from .init_app import app, ref
import uuid
from datetime import date, datetime


# create new job in database
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

# edit existing job in database
@app.route('/editjob', methods=["POST"])
def edit_job():
	try:
		json_data = request.json
		date_posted = json_data["date_posted"]
		job_uid = json_data["jobid"]

		data = {
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
			'status': json_data['status'],
			'additional_questions': json_data['additional_questions']
		}

		ref.child('jobAdvert').child(job_uid).update(data)

		return jsonify({'message': f'Successfully edited job {job_uid}'}),200
	except Exception as e:
		print(e)	
		return jsonify({"message": str(e)}), 400

# get job info given job id
@app.route('/advertisement', methods=["GET"])
def get_job_for_page():
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