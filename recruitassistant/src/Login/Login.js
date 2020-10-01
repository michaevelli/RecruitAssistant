import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import {Card, Container} from 'react-bootstrap';
import axios from "axios";

export const submitApp="localhost:8080/submitapp"

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");


	async function handleSubmit(e) {
		e.preventDefault()
		const ndata = {
			email: {email},
			password: {password}
		}
		console.log(ndata)
		axios.post(submitApp, ndata).then(
		  console.log('well something should have been received by the backend at this point')
		)
	  }
	


	return (
		<div>
			<Container style={{'textAlign': 'center'}}>
				<h1>Recruit Assistant</h1>
				<b>Sign In</b>

				<form onSubmit={handleSubmit}>
					<TextField label="Email" value={email} onChange={e=>setEmail(e.target.value)}></TextField>
					<br></br>
					<TextField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}></TextField>
					<br></br>
					<Button type="submit">Log In</Button>
				</form>
				<br></br>
			
				Don't have an account? <a href="/signup">Sign Up</a>
			</Container>
		</div>
	)
}

export default Login;