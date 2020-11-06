from flask import Flask, request, jsonify
from .init_app import app, ref, pb
import uuid
from datetime import datetime

# needs to delete associated offers/interviews/applications
@app.route('/admin-delete-post', methods=["POST"])
def del_post():

# removes a user and all associated offers/interviews/applications/job post
@app.route('/admin-delete-user', methods=["POST"])