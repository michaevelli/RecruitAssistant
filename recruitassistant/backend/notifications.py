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
	# now = datetime.now()
	# date_time = now.strftime("%m/%d/%Y-%H:%M:%S")
	try:
		ref.child('notif').update({
			notif_id: {
				"type": data["type"],
				"recipient_id": data["uid"],
				"object_id" : data["obj_id"],
				# "date_time": date_time,
				}
			})
		return jsonify({'message': f'Successfully created notif {notif_id}'}),200
	except Exception as e:		
		return jsonify({"message": str(e)}), 400

# records notifications viewed by the user
@app.route('/recnotif', methods=["POST"])
def rec_notif():
	data = request.get_json()
	try:
		ref.child("seenNotifs").update({
			data["uid"] : {
				'list': data["list"]
			}
		})
		return jsonify({'message': "recorded notifications viewed"}),200
	except Exception as e:
		print(e)
		return jsonify({"message": str(e)}), 400

@app.route('/recnotif', methods=["GET"])
def get_seen():
	uid = request.args.get("uid")
	db = pb.database()
	node_exist = db.shallow().get().val()
	if "seenNotifs" in list(node_exist):
		d1 = db.child("seenNotifs").order_by_key().equal_to(uid).get()
		if list(d1) != []:
			return jsonify({"exists": "true", "data": list(d1.val().items())}),200
		else:
			return jsonify({"exists": "true", "data": []}),200
	else:
		return jsonify({"message": "no stored notifications"}), 200

# function removes notifications from user clicking on x button
@app.route('/remnotif', methods=["POST"])
def rem_notif():
	data = request.get_json()
	rem_id = data["id"]
	db = pb.database()
	try:
		db.child('notif').child(rem_id).remove()
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
		d1 = db.child("notif").order_by_child("recipient_id").equal_to(data["uid"]).get()
		# check if it exists then return list of notifications
		if list(d1) != []:
			return jsonify({"exists": "true", "data": list(d1.val().items())}),200
		else:
			return jsonify({"exists": "true", "data": []}),200
	else:
		return jsonify({"message": "no notifications"}), 200
