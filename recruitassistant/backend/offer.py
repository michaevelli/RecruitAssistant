from flask import Flask, request, jsonify
from .init_app import app, ref
from backend import notifications
import uuid
from datetime import date, datetime



@app.route('/offer', methods=["POST"])
def post_offer_letter():
	json_data = request.get_json()
	offer_uid=str(uuid.uuid1())
	
	today = date.today()
	date_posted = today.strftime("%Y-%m-%y")
	#print("d1 =", date_posted),
	
	notif_data = {
				"uid": json_data["jobseeker_id"],
				"obj_id": offer_uid,
				"type" : "offer update",
				"url" : f"http://localhost:3000/offer/{offer_uid}",
			}
	notifications.notify(notif_data)

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
					'full_name': json_data['full_name'],
					'job_id': json_data['jobadvert_id'],
					'job_type': json_data['job_type'],
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
			})
		ref.child('jobApplications').child(json_data['jobadvert_id']).child(json_data['jobapplication_id']).child('status').set('offer')
		return jsonify({'message': f'Successfully created offer {offer_uid}'}),200
	except Exception as e:		
		return jsonify({"message": str(e)}), 400


# gets a list of offers for a given job
@app.route('/offerslist', methods=["GET"])
def get_offers_for_job():
	try:
		jobid = request.args.get('job_id')
		post = ref.child('offer').order_by_child('job_id').equal_to(jobid).get()
		offers = []
		for key,val in post.items():
			offers.append((key, val))
		
		# print(offers)
		return jsonify({'offers': offers}),200
 
	except Exception as e:		
		print(e)
		return jsonify({"message": str(e)}), 400


# get list of offers for given user (recruiter or job seeker)
@app.route('/offers', methods=['POST'])
def offers():
	try:
		data = request.json
		userid = data["userid"]
		if data["type"] == "jobseeker":
			user_type = 'jobseeker_id'
		else:
			user_type = 'recruiter_id'

		posts = ref.child("offer").order_by_child(user_type).equal_to(userid).get()
		offers = []
		for key, val in posts.items():
			offers.append((key, {
				"jobseekerid": val["jobseeker_id"],
				"title": val["title"],
				"status": val["status"],
				"company": val["company"],
				"location": val["location"],
				"job_type": val["job_type"]
			}))
		
		return jsonify({'offers': offers}), 200
	except Exception as e:
		print(e)
		return jsonify({"error": str(e)}),500

# get offer details
@app.route('/getOfferDetails', methods=['POST'])
def viewOffer():
	try:
		offerId = request.json["offerId"]	
		offer=ref.child("offer").child(offerId).get()
		return jsonify({'offer': offer}), 200
	except Exception as e:
		print(e)
		return jsonify({"error": str(e)}),500


# accept an offer (jobseeker)
@app.route('/updateoffer', methods=['POST'])
def update_offer():
	try:
		offer_id = request.json["offer_id"]
		
		ref.child("offer").child(offer_id).child("status").set(request.json["status"])
		status = request.json["status"]
		
		notif_data = {
			"uid": ref.child("offer").child(offer_id).child("recruiter_id").get(),
			"obj_id": offer_id,
			"type" : f"{status} offer",
			"url" : f"http://localhost:3000/offer/{offer_id}",
		}
		notifications.notify(notif_data)

		return jsonify({'message': f'Successfully accepted offer {offer_id}'}),200
	except Exception as e:
		print(e)
		return jsonify({"message": str(e)}), 400