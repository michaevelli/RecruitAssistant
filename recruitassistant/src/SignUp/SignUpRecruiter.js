import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import {Container} from 'react-bootstrap';
import axios from "axios";

export const submitApp="localhost:8080/submitapp"

function SignUpRecruiter() {
    const [full_name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault()
        if (password === repassword) {
            const ndata = {
                full_name: {full_name},
                company: {company},
                email: {email},
                password: {password},
                type: "recruiter"
            }
            console.log(ndata)
            axios.post(submitApp, ndata).then(
                console.log('signed up a recruiter'),
            )
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

                    <TextField label = "Company" value = {company} onChange = {e=>setCompany(e.target.value)}> </TextField>
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

export default SignUpRecruiter;