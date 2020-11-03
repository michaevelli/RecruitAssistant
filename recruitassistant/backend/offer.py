from flask import Flask, request, jsonify
from .init_app import app, ref


# gets a list of offers for a given job
@app.route('/offerslist', methods=["GET"])
def get_offers_for_job():
	try:
		jobid = request.args.get('job_id')
		post = ref.child('offer').order_by_child('job_id').equal_to(jobid).get()
		offers = []
		for key,val in post.items():
			offers.append((key, val))
		
		print(offers)
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
@app.route('/acceptoffer', methods=['POST'])
def accept_offer():
	try:
		offer_id = request.json["offer_id"]
		ref.child("offer").child(offer_id).child("status").set("accepted")
		return jsonify({'message': f'Successfully accepted offer {offer_id}'}),200
	except Exception as e:
		print(e)
		return jsonify({"message": str(e)}), 400


# decline an offer (jobseeker or recruiter)
@app.route('/declineoffer', methods=['POST'])
def decline_offer():
	try:
		offer_id = request.json["offer_id"]
		ref.child("offer").child(offer_id).child("status").set("rejected")
		return jsonify({'message': f'Successfully declined offer {offer_id}'}),200
	except Exception as e:
		print(e)
		return jsonify({"message": str(e)}), 400