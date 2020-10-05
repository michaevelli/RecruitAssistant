import React, { useState } from "react";
import { TextField, Button, Grid } from "@material-ui/core";
import {Card, Container} from 'react-bootstrap';
// import {Link} from 'react-router-dom';
import { useHistory } from "react-router-dom";
import Typography from '@material-ui/core/Typography';


function SignUp(props) {
	const history = useHistory();

	return (
		<Container style={{'textAlign': 'center'}}>
	  	<Typography variant="h3"  style={{color: '#348360' }}>
				RecruitAssistant
			</Typography>
			<p>Sign Up</p>
			<Container style={{'textAlign': 'center'}}>
			
				<div>       
					<p> I am a ...</p>
				</div>
					
				<Button 
					onClick={() => history.push('/signuprecruiter')}
					variant="contained"
					style={{"margin":10 }}>
					Recruiter
				</Button>
				<Button 
					onClick={() => history.push("/signupjobseeker")}
					variant="contained"
					style={{"margin":10 }}>
					Job Seeker
				</Button>


			</Container>
		</Container>
	)
}

export default SignUp;

