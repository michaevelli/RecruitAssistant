import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {IconButton,Grid,Button,TextField} from "@material-ui/core";
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import {Form,Container,InputGroup,Col,Row} from 'react-bootstrap';
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const interviewURL ="http://localhost:5000/interviews"

function InterviewModal() {
    //control modal visibility
    const [visible, setVisible] = useState(false);
    const handleClose = () => setVisible(false);
    const handleShow = () => setVisible(true);

    //TODO pass as props from the application card 
    const [interviewID, setInterviewID]= useState("")
    const [status, setStatus]= useState("")
    const [time, setTime]= useState("")
    const [date, setDate]= useState("")
    
  
    useEffect(() => {
		auth();
		//getInterview(jobID,jobAppID,jobseekerID);	
    },[]);

    // async function getInterview(interviewID) {
	// 	await axios.get(interviewURL, {params: {job_id: jobID}})
	// 		.then(res => {
	// 			console.log(res.data.job[0][1])
	// 			const interview_data = res.data.job[0][1]
    //             setStatus(interview_data["status"])
				
	// 		}).catch((error) => {
	// 			console.log("error: ", error.response)
	// 			alert("An error occured, please try again")
	// 		})	
	// }

    
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

    //response can be "accepted" or "declined"
    const handleResponse = async (response) => {
        //update interview status
        await axios.patch(interviewURL, {'status': response, 'id':interviewID})
        .then(res => {
            console.log("response: ", res)
            alert("interview status successfully updated")
            //get rid of pop up
            setVisible(false);
            //TODO change to /applications url
            history.push("/offers")
        })
        .catch((error) => {
            console.log("error: ", error.response)
            alert("An error occured, please try again")
        })	
        
    }
   

    //if status is pending give option to accept/decline
    //else simply show the date and time info
    return (
        status=="pending"? 
        (<>
        <Button variant="primary" onClick={handleShow}>
        Respond
        </Button>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Interview Invite</Modal.Title>
        </Modal.Header>
        <Modal.Body>Time and date: {time} {date} </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleResponse("Accepted")}>
            Accept
            </Button>
            <Button variant="primary" onClick={handleResponse("Declined")}>
            Decline
            </Button>
        </Modal.Footer>
        </Modal>
        </>
        ):(
        <>
        <Button variant="primary" onClick={handleShow}>
        View interview
        </Button>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Interview Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>Time and date: {time} {date} </Modal.Body>
        </Modal>
        </>)
    )
}
  
  