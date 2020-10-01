import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import {Card, Container} from 'react-bootstrap';
import axios from "axios";
import { useHistory } from "react-router-dom";

export const submitLogin="http://localhost:5000/login"

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorStatus, setErrorStatus] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const history = useHistory();


	async function handleSubmit(e) {
		e.preventDefault()
		const ndata = {
			email: email,
			password: password
		}
		console.log(ndata);
		
		axios.post(submitLogin, ndata)
			.then(function(response) {
				console.log("response:")
				console.log(response)
				window.localStorage.setItem("RAToken", response.data.token)
				window.localStorage.setItem("RAID", Object.keys(response.data.user)[0])
				window.localStorage.setItem("RACompany", response.data.user[Object.keys(response.data.user)[0]].company)
				window.localStorage.setItem("RAEmail", response.data.user[Object.keys(response.data.user)[0]].email)
				window.localStorage.setItem("RAFirstName", response.data.user[Object.keys(response.data.user)[0]].first_name)
				window.localStorage.setItem("RALastName", response.data.user[Object.keys(response.data.user)[0]].last_name)
				window.localStorage.setItem("RAType", response.data.user[Object.keys(response.data.user)[0]].type)
				history.push("/dashboard");
				
			})
			.catch(function(error){
				console.log("error:")
				console.log(error.response)
				setErrorMessage(error.response.data.message)
				setErrorStatus("True")

			})

	}

	


	return (
		<div>
			<Container style={{'textAlign': 'center'}}>
				<h1>Recruit Assistant</h1>
				<b>Sign In</b>
				<div id="error" style={{color: 'red'}}>{errorMessage}</div>
				<form onSubmit={handleSubmit}>
					<TextField label="Email" value={email} error={errorStatus} onChange={e=>setEmail(e.target.value)}></TextField>
					<br/>
					<TextField label="Password" type="password" value={password} error={errorStatus} onChange={e=>setPassword(e.target.value)}></TextField>
					<br/>
					<Button type="submit">Log In</Button>
				</form>
				<br></br>
			
				Don't have an account? <a href="/signup">Sign Up</a>
			</Container>
		</div>
	)
}

export default Login;