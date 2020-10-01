import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import {Card, Container} from 'react-bootstrap';
import axios from "axios";

export const submitLogin="http://localhost:5000/login"

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");


	async function handleSubmit(e) {
		const ndata = {
			email: email,
			password: password
		}
		console.log(ndata)
		let response = await axios.post(submitLogin, ndata);

		if (response.data.success === true) {
			console.log("good login")
			// history.push('/dashboard')
		}
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
				<br/>
			
				Don't have an account? <a href="/signup">Sign Up</a>
			</Container>
		</div>
	)
}

export default Login;