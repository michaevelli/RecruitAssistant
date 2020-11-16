RecruitAssistant is Group SIGSEGV's project for COMP3900 (2020). 
RecruitAssistant is a web application that allows job seekers to search and apply for jobs, and recruiters to post job adverts and 
track candidates through application,interview and offer stages.

To run: Open two terminals in the recruitassistant directory, one for frontend and one for backend and follow these steps.

Frontend: 
cd recruitassistant
npm install
npm start

Note: Ensure port 5000 is free on CSE - our backend runs on this port!
Backend:
cd recruitassistant
python3 -m venv env
source env/bin/activate
pip3 install wheel
pip3 install -r requirements.txt
python3 -m flask run

This project was bootstrapped with Create React App.
