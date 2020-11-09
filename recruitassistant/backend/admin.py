from flask import Flask, request, jsonify
from .init_app import app, ref, pb
import uuid
from datetime import datetime

db = pb.database()

def remove_list(data_list, node):
    print(data_list)
    if(data_list != []):
        for i in data_list:
            db.child(node).child(i).remove()


# needs to delete associated offers/interviews/applications
@app.route('/admin-delete-post', methods=["POST"])
def del_post():
    json_data = request.get_json()
    post_id = json_data["id"]
    try:
        # delete associated offers
        remove_list(ref.child('offer').order_by_child('job_id').equal_to(post_id).get(), "offer")

        # delete associated interviews
        remove_list(ref.child('interviews').order_by_child('job_id').equal_to(post_id).get(), "interviews")

        # delete associated notifications
        # do check in remove_list if there are associated notifs, delete notifs
        # remove_list(ref.child('notif').order_by_child('object_id').equal_to(post_id).get(), "notif")

        # delete associated applications
        db.child('jobApplications').child(post_id).remove()

        # delete final advert
        db.child('jobAdvert').child(post_id).remove()

        return jsonify({'message': f'Successfully deleted post {post_id} and associated items'}),200
    except Exception as e:		
        print(e)
        return jsonify({"message": str(e)}), 400


@app.route('/admin-get-users', methods=["POST"])
def get_users():
    try:
        user_list = list(ref.child('user').order_by_key().get().items())
        return jsonify({'message': 'Success', 'data' : user_list}), 200
    except Exception as e:
        print(e)
        return jsonify({"message": str(e)}), 400

# removes a user and all associated offers/interviews/applications/job post
@app.route('/admin-delete-user', methods=["POST"])
def del_user():
    json_data = request.get_json()
    user_id = json_data["uid"]
    try:
        if(json_data["type"] == "jobseeker"):
            # remove offer
            remove_list(ref.child('offer').order_by_child('jobseeker_id').equal_to(user_id).get(),'offer')
            # remove interviews
            remove_list(ref.child('interviews').order_by_child('jobseeker_id').equal_to(user_id).get(), 'interviews')
            # remove application
            remove_list(ref.child('jobApplications').order_by_child('jobseeker_id').equal_to(user_id).get(), 'jobApplications')
        elif(json_data["type"]=="recruiter"):
            # remove offers
            remove_list(ref.child('offer').order_by_child('recruiter_id').equal_to(user_id).get(),'offer')
            # remove interviews
            remove_list(ref.child('interviews').order_by_child('employer_id').equal_to(user_id).get(), 'interviews')
            # remove job advertisement
            remove_list(ref.child('jobAdvert').order_by_child('recruiter_id').equal_to(user_id).get(), 'jobAdvert')
        
        # remove notifications
        # notif exist check
        notif_exist = db.shallow().get().val()
        if("notif" in list(notif_exist)):
            child_exist = db.child("notif").shallow().get().val()
            if(user_id in list(child_exist)):
                db.child('notif').child(user_id).remove()
            
        # remove user
        db.child('user').child(user_id).remove()
        return jsonify({'message': f'Successfully deleted user {user_id} and associated items'}),200
    except Exception as e:
        print(e)
        return jsonify({"message": str(e)}), 400