from flask import Flask, request, jsonify
from .init_app import app, ref, pb
import uuid

# receives type of notification (i.e. interview/offer/counteroffer)
# function is called from hooking into interview/offer/counteroffer functions
# sets information in database under notification node
# obj_id is necessary so user can click and view the specified item
def notify(data, type_notif, obj_id):
	notif_id=str(uuid.uuid1())
	try:
		ref.child('notif').update({
			notif_id: {
				"type": type_notif,
				"recipient_id": data["uid"],
				"object_id" : obj_id
				}
			})
		return jsonify({'message': f'Successfully created notif {notif_id}'}),200
	except Exception as e:		
		return jsonify({"message": str(e)}), 400

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
