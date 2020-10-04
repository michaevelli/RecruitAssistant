import React, { useState } from "react";
// import { withRouter } from 'react-router-dom';
import { TextField, Button } from "@material-ui/core";
import {Container} from 'react-bootstrap';
import axios from "axios";
import { useHistory } from "react-router-dom";

export const submitSignUp="http://localhost:5000/signup"

function SignUpJobSeeker(props) {
	const [first_name, setFirstName] = useState("");
	const [last_name, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repassword, setRepassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const history = useHistory();

	async function handleSubmit(e) {
		e.preventDefault()
		setErrorMessage("")
		if (password === repassword) {
			const ndata = {
				first_name: first_name,
				last_name: last_name,
				email: email,
				password: password,
				type: "jobseeker"
			}
			console.log(ndata)
			axios.post(submitSignUp, ndata)
				.then(function(response) {
					console.log("response:", response)
					alert("successfully created account")
					history.push("/login")
				})
				.catch(function(error){
					console.log("error:", error.response)
					setErrorMessage(error.response.data.message)
					
				})
		} else {
			setErrorMessage("Passwords do not match")
		} 
	}
	
	
	return (
		<div>
			<Container style={{'textAlign': 'center'}}>
				<h1>Recruit Assistant</h1>
				<b>Sign Up</b>
				
				<form onSubmit={handleSubmit}>
					<TextField label = "First Name" value = {first_name} onChange = {e=>setFirstName(e.target.value)}> </TextField>
					<br></br>

					<TextField label = "Last Name" value = {last_name} onChange = {e=>setLastName(e.target.value)}> </TextField>
					<br></br>

					<TextField label = "Email" value = {email} onChange = {e=>setEmail(e.target.value)}> </TextField>
					<br></br>

					<TextField label = "Password" type = "password" value = {password} onChange = {e=>setPassword(e.target.value)}> </TextField>
					<br></br>

					<TextField label = "Re-enter password" type = "password" value = {repassword} onChange = {e=>setRepassword(e.target.value)}> </TextField>
					<br></br>
					<div id="error" style={{color: 'red'}}>{errorMessage}</div>
					<Button type="submit"> Sign Up </Button>
				</form>
			</Container>
		</div>
	)
}

export default SignUpJobSeeker;