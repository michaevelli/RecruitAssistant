import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {IconButton,Grid,Button,TextField} from "@material-ui/core";
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import {Form,Container,InputGroup,Col,Row} from 'react-bootstrap';
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";
export const interviewURL ="http://localhost:5000/jobapplication"
function InterviewModal() {
    //control modal visibility
    const [visible, setVisible] = useState(false);
    const handleClose = () => setVisible(false);
    const handleShow = () => setVisible(true);
    const [interview, setInterview]= useState("")
    //somehow get these from the applications card we click a button from
    const jobID=""
    const jobAppID=""
    const jobseekerID=""
    useEffect(() => {
		auth();
		getInterview(jobID,jobAppID,jobseekerID);
		
    },[]);

    async function getInterview(interviewID) {
		await axios.get(interviewURL, {params: {job_id: jobID}})
			.then(res => {
				console.log(res.data.job[0][1])
				const job_data = res.data.job[0][1]
				setTitle(job_data["title"]);
				setCompany(job_data["company"]);
				setLocation(job_data["location"]);
				setJobType(job_data["job_type"]);
				setSalary(job_data["salary_pa"]*1000);
				
			}).catch((error) => {
				console.log("error: ", error.response)
				alert("An error occured, please try again")
			})	
	}

    
    const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				// const recruiterID = sessionStorage.getItem("uid")			
				if (!response.success || response.userInfo["type"] != "jobseeker") {
					history.push("/unauthorised");
				}
			})
	}
    return (
        <>
            <Button variant="primary" onClick={handleShow}>
            View invite
            </Button>
    
            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Interview Invite</Modal.Title>
            </Modal.Header>
            <Modal.Body>Time and date: </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Accept
                </Button>
                <Button variant="primary" onClick={handleClose}>
                Decline
                </Button>
            </Modal.Footer>
            </Modal>
        </>
        );
    
  }
  
  