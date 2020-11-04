from flask import Flask, request, jsonify
from .init_app import app, ref, pb
import uuid
from datetime import datetime

# receives type of notification (i.e. interview/offer/counteroffer)
# function is called from hooking into interview/offer/counteroffer functions
# sets information in database under notification node
# obj_id is necessary so user can click and view the specified item
def notify(data):
	notif_id=str(uuid.uuid1())
	now = datetime.now()
	date_time = now.strftime("%m/%d/%Y-%H:%M:%S")
	try:
		ref.child('notif').child(data["uid"]).push({
				"type": data["type"],
				"object_id" : data["obj_id"],
				"date_time": date_time,
				"url" : data["url"],
				"seen" : False,
				}
			)
		return jsonify({'message': f'Successfully created notif {notif_id}'}),200
	except Exception as e:		
		return jsonify({"message": str(e)}), 400

# should update database with items "seen" status to true
@app.route('/recnotif', methods=["POST"])
def rec_notif():
	data = request.get_json()
	seen_list = data["list"]
	try:
		for i in seen_list:
			ref.child("notif").child(data["uid"]).child(i).child("seen").set(True)
		return jsonify("message", "fine"), 200
	except Exception as e:
		return jsonify({"message": str(e)}), 400


# function removes notifications from user clicking on x button
@app.route('/remnotif', methods=["POST"])
def rem_notif():
	data = request.get_json()
	rem_id = data["id"]
	uid = data["uid"]
	db = pb.database()
	try:
		db.child('notif').child(uid).child(rem_id).remove()
		return jsonify({'message': 'removed'}), 200
	except Exception as e:
		return jsonify({'message': str(e)}), 400

# function which checks and returns notification list
@app.route('/checknotif', methods=["POST"])
def check_notif():
	data = request.get_json()
	db = pb.database()
	notif_exists = db.shallow().get().val()
	
	if "notif" in list(notif_exists):
		# check if it exists then return list of notifications
		child_exist = db.child("notif").shallow().get().val()
		if data["uid"] in list(child_exist):
			d2 = db.child("notif").child(data["uid"]).order_by_child("date_time").get()
			return_l = list(d2.val().items())
			return_l.reverse()
			# d2 = db.child("notif").child(data["uid"]).get()
			# return_l = list(d2.val().items())

			return jsonify({"exists": "true", "data": return_l}),200
		else:
			return jsonify({"exists": "true", "data": []}),200
	else:
		return jsonify({"message": "no notifications", "data": []}), 200
