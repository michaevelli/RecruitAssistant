import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import {Container} from 'react-bootstrap';
import axios from "axios";

export const submitApp="http://127.0.0.1:5000/signup"

function SignUpJobSeeker() {
    const [full_name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault()
        if (password === repassword) {
            const ndata = {
                full_name: {full_name},
                email: {email},
                password: {password},
                type: "jobseeker"
            }
            console.log(ndata)
            axios.post(submitApp, ndata).then(function(response) {
				console.log("response:")
				console.log(response)
				//store appropriate response data in localstorage
				//redirect to dashboard
			})
			.catch(function(error){
				console.log("error:")
				console.log(error.response)
				//add to html to display error
			})
        } else {
            alert('Passwords do not match.')
        } 
    }
    
    
	return (
        <div>
            <Container style={{'textAlign': 'center'}}>
                <h1>Recruit Assistant</h1>
                <b>Sign Up</b>
                
                <form onSubmit={handleSubmit}>
                    <TextField label = "Full Name" value = {full_name} onChange = {e=>setName(e.target.value)}> </TextField>
                    <br></br>

                    <TextField label = "Email" value = {email} onChange = {e=>setEmail(e.target.value)}> </TextField>
                    <br></br>

                    <TextField label = "Password" type = "password" value = {password} onChange = {e=>setPassword(e.target.value)}> </TextField>
                    <br></br>

                    <TextField label = "Re-enter password" type = "password" value = {repassword} onChange = {e=>setRepassword(e.target.value)}> </TextField>
                    <br></br>
                    
                    <Button type="submit"> Sign Up </Button>
                </form>
            </Container>
        </div>
	)
}

export default SignUpJobSeeker;