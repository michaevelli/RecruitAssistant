import time
from flask import Flask, request
from flask import jsonify
# from flask_cors import CORS
# import firebase_admin
# from firebase_admin import credentials, auth, db
from firebase_admin import auth
import json
import uuid
from datetime import date, datetime
import atexit
from apscheduler.schedulers.background import BackgroundScheduler
from backend import jobs,statistics, search,interviews, authentication, offer,notifications, counteroffer, admin, applications
from backend.init_app import app, ref, pb

def print_date_time():
    print(time.strftime("%A, %d. %B %Y %I:%M:%S %p"))

#Automatically closes jobs whose closing date has been surpassed.
def check_postings():
	posts=ref.child("jobAdvert").get()
	for key in posts.keys():
		#if current datetime has exceeded closing date, close the thing
		try:
			close_date = datetime.strptime(posts[key]["closing_date"], "%Y-%m-%d")
			current_date = datetime.now()
			delta = close_date - current_date
		
			if(delta.days < 0 and posts[key]["status"] == "open"):
				ref.child("jobAdvert").child(key).child("status").set("closed")
			elif(delta.days > 0 and posts[key]["status"] == "closed"):
				ref.child("jobAdvert").child(key).child("status").set("open")
		except:
			print("failed to update for some reason")
			print(key)

scheduler = BackgroundScheduler()
scheduler.add_job(func=check_postings, trigger="interval", seconds=60)
scheduler.start()
# atexit.register(lambda: scheduler.shutdown())
