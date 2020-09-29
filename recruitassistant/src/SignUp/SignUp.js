import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import {Card, Container} from 'react-bootstrap';


export default function SignUp() {
	
  const [user_type, setPassword] = useState("");

	return (
		<div>
            <h1> RecruitAssistant </h1>
            <h> Sign Up </h>
            <p> I am a ...</p>
            <Button variant="contained">Recruiter</Button>
            <Button variant="contained">Job Seeker</Button>


        </div>
	)
}

