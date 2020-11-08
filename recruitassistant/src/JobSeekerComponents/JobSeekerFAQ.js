import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Grid} from "@material-ui/core";
import {Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";


export default function JobSeekerFAQ() {
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
				if (!response.success || response.userInfo["type"] != "jobseeker") {
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
						{'text':'JobSeeker Dashboard','href': '/jobseekerdashboard','active': false},
						{'text':'FAQ','href':'#','active': true}]}/>
				</Col>

				<Col sm="9">
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						FAQ
					</Typography>
					<div style={{paddingLeft: 40}}>
						
                        <h style={{fontWeight: 'bold'}}> How do I see the status of my applications?</h>
                        <p> On the Job Seeker Dashboard click 'My applications' to view all your past applications.
							Click on the 'InterviewS' tab to see which jobs you have interview invites,
							and the 'Offers' tabs to view all received offers.
                        </p>

                        <h style={{fontWeight: 'bold'}}>  Why can't I apply for a job?</h>
                        <p> You have already applied for this job or the job is closed.
                        </p>

						<h style={{fontWeight: 'bold'}}> Can a recruiter cancel my offer?</h>
                        <p> If you request a counter offer that the recruiter deems unreasonable, they may cancel your offer.
                        </p>
                       
                        <br />
                        <p style={{fontWeight: 'bold',fontStyle: 'italic'}}> More Questions? Contact us at fakesupportemail@recruitassistant.com </p>
					</div>
				</Col>
			</Row>
		</Grid>
	);
}