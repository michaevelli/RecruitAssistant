import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Grid,Button,TextField} from "@material-ui/core";
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import {Col,Row} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const interviewURL ="http://localhost:5000/interviews"

export default function InterviewPage({match}) {
    const history = useHistory()
    const interviewID = match.params.interviewID;
   
    const [status, setStatus] = useState('')
    const [time, setTime] = useState('')
    const [date, setDate] = useState('')
    const [reason, setReason] = useState('')
    const [loading, setLoading] =useState(false)
    const [show, setShow] = useState('')
  
    useEffect(() => {
        auth();
        getInterviewDetails();
    },[]);

    
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

    const getInterviewDetails = async () => {
        await axios.get(`${interviewURL}/${interviewID}`)
        .then(res => {   
            const interview_data = res.data.interview
            console.log(interview_data)
            setDate(interview_data["interview_date"]);
            setTime(interview_data["interview_time"]);
            setStatus(interview_data["status"] || 'Pending'); 
            setReason(interview_data["reason"] || ''); 
            setLoading(false)
        }).catch((error) => {
            console.log("error: ", error.response)
        })	
    }

    //response can be "accepted" or "declined"
    const handleResponse = async (response) => {
        //update interview status
        var givenreason = reason
        if (response === "Accepted") {
            givenreason = ""
            setShow(false)
        }
        await axios.patch(interviewURL, {'status': response, 'id':interviewID, 'reason': givenreason})
        .then(res => {
            console.log("response: ", res)
            alert("Interview response has been sent", response)
            history.push("/offers")
        })
        .catch((error) => {
            console.log("error: ", error.response)
            alert("An error occured, please try again")
        })	
        
    }
    
    //field showing up when declined
    const renderDecline = () => {
        return (
            <Alert show = {show} color = "primary" onClose={() => setShow(false)} dismissible style={{color: 'black', margin: 50}}>
                <Alert.Heading>Decline the Interview</Alert.Heading>
                    <p>Provide a reason (optional) for declining and confirm you want to decline the interview.</p>
                    <hr/>
                    <div>
                        <TextField
                            name = "Reason"
                            variant = "outlined"
                            style = {{width: 750, marginRight: 50}}
                            value = {reason}
                            placeholder = "Optional reason"
                            onChange = { (event) => setReason(event.target.value)}/>
                        <Button onClick={() => handleResponse("Declined")} variant = "contained" color="secondary" style = {{marginTop: 8.5}}>
                            Confirm
                        </Button>
                    </div>
            </Alert>
        )
    }


    //if status is pending give option to accept/decline
    //else simply show the date and time info
    const interviewInfo = () => {
        return status=="Pending"? 
        (
        <Typography component="div" style={{color: 'black', margin: 50}}>
            <Box fontSize="h3.fontSize" fontWeight="fontWeightBold">
                Interview Invite
            </Box>
            <br/>
           
            <Box fontSize="h5.fontSize">
                <span style={{fontWeight: "bold"}}>Date:</span> {date}
            </Box>
            <br/>
            <Box fontSize="h5.fontSize">
                <span style={{fontWeight: "bold"}}>Time:</span> {time}
            </Box>
            <br/>
            <Box style={{marginTop: 50}}>
                <Button variant="contained"  color="secondary" style={{marginRight:30,backgroundColor: 'green'}} onClick={()=>handleResponse("Accepted")}>
                Accept
                </Button>
                <Button variant="contained" color="secondary" onClick={()=>setShow(!show)}>
                Decline
                </Button>
            </Box>
        </Typography>
        ):(
           
            <Typography component="div" style={{color: 'black', margin: 50}}>
                <Box fontSize="h3.fontSize" fontWeight="fontWeightBold">
                    Interview Details
                </Box>
                <br/>
                <Box fontSize="h5.fontSize">
                    <span style={{fontWeight: "bold"}}>Date:</span> {date}
                </Box>
                <br/>
                <Box fontSize="h5.fontSize">
                    <span style={{fontWeight: "bold"}}>Time:</span> {time}
                </Box>
                <br/>
                <Box fontSize="h5.fontSize">
                    <span style={{fontWeight: "bold"}}>Your response:</span> {status }
                </Box>
                <br/>
                <Box fontSize="h5.fontSize" visibility = {reason === "" ? ("hidden"):("visible")}>
                    <span style={{fontWeight: "bold"}}>Reason provided:</span> {reason}
                </Box>
            </Typography>
        )
    }

    return (
        loading? (<p> Loading...</p>):
        (
        
        <Grid>
            <Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 60}}>
				<Col sm={2}>
					<SideMenu random={[
						{'text':'Job Seeker Dashboard','href': '/jobseekerdashboard', 'active': false},
						{'text':'Your Applications','href': '/offers', 'active': false},         
						{'text':'FAQ','href':'/jobseekerFAQ','active': false}]}/>
				</Col >
				<Col>	
                {interviewInfo()}
                {renderDecline()}
                </Col>
            </Row>
        </Grid>  
        ) 
    )
}
  
  
