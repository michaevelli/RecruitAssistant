from flask import Flask, request, jsonify
from .init_app import app, ref
from datetime import date, datetime
import uuid


#get job application statistics for a specific job
@app.route('/jobstats', methods=["GET"])
def get_all_applications(): 
    try:
        jobid = request.args.get('job_id')
        posts=ref.child("jobApplications").child(jobid).get()
        job_title=ref.child("jobAdvert").child(jobid).child('title').get()

        #how many required qualifications the job specified
        max_qualifications=ref.child("jobAdvert").child(jobid).child('req_qualifications').get()
        if(max_qualifications):
            max_qualifications=len(max_qualifications)
        else:
            max_qualifications=0
        #how many interviews sent for this job
        interviews=ref.child('interviews').order_by_child('job_id').equal_to(jobid).get()
        if(interviews):
            num_interviews=len(interviews)
        else:
            num_interviews=0
            
        #how many offers sent for this job
        offers=ref.child('offer').order_by_child('job_id').equal_to(jobid).get()
        if(offers):
            num_offers=len(offers)
        else:
            num_offers=0
        
        num_candidates=0
        num_qualities_met={}
        qualifications={}
        has_working_rights=0
        if posts:
            for p in posts.values():
                num_candidates+=1
                for key, value in p.items():      
                    if key=='rights'and value=='Yes':
                            has_working_rights+=1
                    if key=='qualities_met':
                        if value in num_qualities_met:
                            num_qualities_met[value]+=1
                        else:
                            num_qualities_met[value]=1
                    if key=='qualifications':
                        for v in value:
                            if  v in qualifications:
                                qualifications[v]+=1
                            else:
                                qualifications[v]=1
        
            res={'job_title':job_title,
            'num_candidates': num_candidates,
            'num_offers': num_offers,
            'num_interviews': num_interviews,
            'has_working_rights': has_working_rights,
            'max_qualities_met': max_qualifications,
            'num_qualities_met': num_qualities_met,
            'qualifications': qualifications}   
        else:
            res=None
        return jsonify({"stats": res}), 200
    except Exception as e:
        print(e)
        return jsonify({"message": str(e)}), 400