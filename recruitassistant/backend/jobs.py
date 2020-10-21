from flask import Flask, request, jsonify
from firebase_admin import credentials, auth, db
from .init_app import app, ref

ref = db.reference('/')

@app.route('/editjob', methods=["POST"])
def edit_job():
	# print("----editing job called ---")
	try:
		json_data = request.json
		date_posted = json_data["date_posted"]
		job_uid = json_data["jobid"]
		# recruiter_id = json_data["recruiter_id"]
		# print("recruiter id = " + recruiter_id)

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