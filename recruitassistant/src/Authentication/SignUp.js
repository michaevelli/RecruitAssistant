import React, { useState } from "react";
import { TextField, Button, Grid } from "@material-ui/core";
import {Card, Container} from 'react-bootstrap';
// import {Link} from 'react-router-dom';
import { useHistory } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import logo from '../SharedComponents/Picture2.png'; 

function SignUp() {
	const history = useHistory();

	return (
		<Container style={{'textAlign': 'center'}}>
			<img src={logo} style={{ width:400, height:100, marginBottom:20,marginTop:20, marginLeft:20}}></img>
			<h2>Sign Up</h2>
			<Container style={{textAlign: 'center'}}>
			
				<div>  
					<br/>     
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

