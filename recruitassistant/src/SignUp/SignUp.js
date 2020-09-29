import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import {Card, Container} from 'react-bootstrap';
import {Link} from 'react-router-dom';

export default function SignUp() {
	
  const [userType, setUserType] = useState("");

	return (
        <div>
        <h1 style={{'margin-left': 50}} > RecruitAssistant </h1>
		<Container style={{'textAlign': 'center', 'margin':100}}>
            
             <div >
                    
                    <h> Sign Up </h>
                    <p> I am a ...</p>
            </div>
            <form>
            <Button 
            component={Link} to='/RecruiterSignUp' 
            variant="contained"
            style={{"margin":10}}>Recruiter</Button>
            <Button 
            component={Link} to='/JobSeekerSignUp' 
            variant="contained"
            style={{"margin":10}}>Job Seeker</Button>

            </form> 
        </Container>
        </div>
	)
}

