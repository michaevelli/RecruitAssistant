import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Grid,Button} from "@material-ui/core";
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import {Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const interviewURL ="http://localhost:5000/interviews"

export default function InterviewPage(props) {
    const history = useHistory()

    //passed as props from the Offer.js
    const [status, setStatus]= useState(props.location.state.status)
    const [time, setTime]= useState(props.location.state.time)
    const [date, setDate]= useState(props.location.state.date)
    const interviewID = props.location.state.interviewID
  
    useEffect(() => {
		auth();
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

    //response can be "accepted" or "declined"
    const handleResponse = async (response) => {
        //update interview status
        await axios.patch(interviewURL, {'status': response, 'id':interviewID})
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
    //if status is pending give option to accept/decline
    //else simply show the date and time info
    const interviewInfo = () => {
        return status=="pending"? 
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
                <Button variant="contained" color="secondary" onClick={()=>handleResponse("Declined")}>
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
            </Typography>
        )
    }

    return (
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
                </Col>
            </Row>
        </Grid>   
    )
}
  
  
