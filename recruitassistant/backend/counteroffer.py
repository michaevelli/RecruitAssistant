from flask import Flask, request, jsonify
from datetime import date
from .init_app import app, ref

# submit counter offer
@app.route('/counteroffer', methods=["POST"])
def counter_offer():
	json_data = request.get_json()
	offerID = json_data["offerID"]
	counter = json_data["counteroffer"]
	try:
		ref.child("offer").child(offerID).child("counter_offer").set(counter)
		ref.child("offer").child(offerID).child("status").set("countered")
		# print('success')
		return jsonify({'message': f'Successfully updated counter offer {offerID}'}),200
	except Exception as e:
		print(e)
		return jsonify({"message": str(e)}), 400

@app.route('/editoffer', methods=["POST"])
def edit_offer():
	try:
		json_data = request.get_json()
		offer_uid = json_data["offerid"]

		today = date.today()
		date_posted = today.strftime("%Y-%m-%y")

		data = {
			'title':json_data["title"],
			'location':json_data["location"],
			'description': json_data['description'],
			'company':json_data["company"],
			'date_posted': date_posted,
			'recruiter_id': json_data['recruiter_id'],
			'application_id': json_data['jobapplication_id'],
			'jobseeker_id': json_data['jobseeker_id'],
			'full_name': json_data['full_name'],
			'job_type': json_data['job_type'],
			'job_id': json_data['jobadvert_id'],
			'salary': json_data['salary'],
			'salary_type': json_data['salary_type'],
			'hours': json_data['hours'],
			'days': json_data['days'],
			'start_date': json_data['start_date'],
			'end_date': json_data['end_date'],
			'status': json_data['status'], 
			'additional_docs': json_data['additional_docs'],
			'counterable':json_data['counterable']
		}

		ref.child('offer').child(offer_uid).update(data)

		return jsonify({'message': f'Successfully edited offer {offer_uid}'}),200
	except Exception as e:
		print(e)	
		return jsonify({"message": str(e)}), 400
