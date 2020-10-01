import React, { useState } from "react";
import { TextField, Button, Grid } from "@material-ui/core";
import {Card, Container} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';


function SignUp() {
	
	//const [userType, setUserType] = useState("");

	return (
		<Container style={{'textAlign': 'center'}}>
	       <Typography variant="h3"  style={{color: '#348360' }}>
		 RecruitAssistant
		</Typography>
		<p>Sign Up</p>

		<Container style={{'textAlign': 'center'}}>
		
		<div >       
			<p> I am a ...</p>
		</div>
	     
		<Button 
		component={Link} to='/RecruiterSignUp' 
		variant="contained"
		style={{"margin":10 }}>Recruiter</Button>
		<Button 
		component={Link} to='/JobSeekerSignUp' 
		variant="contained"
		style={{"margin":10 }}>Job Seeker</Button>

		</Container>
	</Container>
	)
}

export default SignUp;

