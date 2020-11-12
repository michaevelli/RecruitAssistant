from flask import Flask, request, jsonify
from .init_app import app, ref
import re

# search and filter job postings on dashboard
@app.route('/jobadverts/search', methods=["POST"])
def search():
	try:
		datajson = request.json
		print(datajson)

		search = datajson["search"]
		location = datajson["location"]
		exp = datajson["exp"]
		jobtype = datajson["jobtype"]
		salaryrange = datajson["salaryrange"]

		posts=ref.child("jobAdvert").get()	
		jobs=[]
		for key,val in posts.items():
			# filter: location listed must have location specified
			if location.lower() != "" and not location.lower() in val["location"].lower():
				continue
			# filter: job type asked for must match job type specified
			if jobtype.lower() != "" and not jobtype.lower() == val["job_type"].lower():
				continue
			# filter: experience level asked for must match experience level specified
			if exp.lower() != "" and not exp.lower() == val["experience_level"].lower():
				continue
			# filter: salary specified must fall within the range asked for
			if (int(val["salary_pa"]) < salaryrange[0]*1000) or (int(val["salary_pa"]) > salaryrange[1]*1000 and (salaryrange[1] != 200)):
				continue
			
			if search != "":
				searchtext = val["company"].lower() + " " + val["description"].lower() + " " + val["title"].lower() + " " + val["req_qualifications"].lower()
				try:
					for i in range(len(val["responsibilities"])):
						searchtext = searchtext + " " + val["responsibilities"][i].lower()
				except:
					pass
				searchtext = re.sub(re.compile("\W"), " ", searchtext)
				searchtext = ' '.join([w for w in searchtext.split() if len(w)>3])
				
				searchqueries = search.lower()
				searchqueries = re.sub(re.compile("\W"), " ", searchqueries)
				for word in searchqueries.split():
					if len(word) <= 3:
						continue
					if word in searchtext:
						jobs.append((key, val))
						break
			else:
				jobs.append((key, val))


		return jsonify({'jobs': jobs}),200
	except Exception as e:
		print(e)
		return jsonify({"error": "something bad happened"}),500