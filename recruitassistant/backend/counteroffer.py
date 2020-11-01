from flask import Flask, request, jsonify
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

# TODO: edit existing offer in database
@app.route('/editoffer', methods=["POST"])
def edit_offer():
	try:
		json_data = request.get_json()
		offer_uid = json_data["offerid"]

		# also change offer status
		# data = {
		# 	'title':json_data["title"],
		# 	'location':json_data["location"],
		# 	'description': json_data['description'],
		# 	'company':json_data["company"],
		# 	'date_posted': date_posted,
		# 	'closing_date':json_data["closing_date"],
		# 	'recruiter_id':json_data["recruiter_id"],
		# 	'job_type': json_data["job_type"],
		# 	'salary_pa':json_data["salary_pa"],
		# 	'experience_level':json_data["experience_level"],
		# 	'req_qualifications':json_data["qualifications"],
		# 	'responsibilities': json_data['responsibilities'],
		# 	'required_docs': json_data["required_docs"],
		# 	'status': json_data['status'],
		# 	'additional_questions': json_data['additional_questions']
		# }

		# ref.child('jobAdvert').child(job_uid).update(data)

		return jsonify({'message': f'Successfully edited offer {offer_uid}'}),200
	except Exception as e:
		print(e)	
		return jsonify({"message": str(e)}), 400
