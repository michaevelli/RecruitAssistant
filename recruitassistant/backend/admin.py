from flask import Flask, request, jsonify
from .init_app import app, ref, pb
import uuid
from datetime import datetime

db = pb.database()

def remove_list(data_list, node):
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
        print(user_list)
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
        # remove offers
        # remove interviews
        # remove applications
        # remove job posts
        # remove notifications
        # remove user
        db.child(user).child(user_id).remove()
        return jsonify({'message': f'Successfully deleted user {user_id} and associated items'}),200
    except Exception as e:
        return jsonify({"message": str(e)}), 400