import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Grid} from "@material-ui/core";
import {Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";


export default function RecruiterDashboard() {
	// var recruiterID = "1234";
	const recruiterID = sessionStorage.getItem("uid")
	const history = useHistory();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		auth();
	}, [recruiterID]);

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				setLoading(false)
				// const recruiterID = sessionStorage.getItem("uid")			
				if (!response.success || response.userInfo["type"] != "recruiter") {
					history.push("/unauthorised");
				}
			})
	}


	return loading ? (
		<div></div>
	) : (
		<Grid>
			<Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 60}}>
				<Col sm="2">
					<SideMenu random={[
						{'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': false},
						{'text':'FAQ','href':'#','active': true}]}/>
				</Col>

				<Col sm="9">
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						FAQ
					</Typography>
					<div style={{paddingLeft: 40}}>
						
                        <h style={{fontWeight: 'bold'}}> How do I see the interviews or offers I have sent?</h>
                        <p> On the Recruiter Dashboard click "view applications"
                            on a job. You will be taken to a new page where you will find menu links
                            to view interviews or offers related to this job.
                        </p>

                        <h style={{fontWeight: 'bold'}}>  Why can't I send interview invites? </h>
   
                        <p> You cannot send interview invites until a job has surpassed its closing date.
                        </p>
                        <h style={{fontWeight: 'bold'}}>  Can I extend the closing date of a job advert? </h>
                        
                        <p> Yes, click 'Edit Job' on a job from the recruiter dashboard.
                        </p>
                        <br />
                        <p style={{fontWeight: 'bold',fontStyle: 'italic'}}> More Questions? Contact us at fakesupportemail@gmail.com </p>
					</div>
				</Col>
			</Row>
		</Grid>
	);
}