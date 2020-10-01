import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import {Card, Container} from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import axios from "axios";

export const submitLogin="http://localhost:5000/login"

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState("");
	const [redirect, setRedirect] = useState(false);
	const [error, setError] = useState(false);

	async function handleSubmit(e) {
		const ndata = {
			email: email,
			password: password
		}
		console.log(ndata)

		await axios.post(submitLogin, ndata)
			.then(res => {
				if (res.data.success) {
					setUser(res.data.user.type)
					setRedirect(true)
					setError(false)
					console.log(res.data.user)
					sessionStorage.setItem('token', res.data.token);
				}
			})
			.catch(() => {
				setError(true)
			})		
	}

	let errorMessage;
	if(error) {
		errorMessage = <p style={{color:'red'}}>Username or password incorrect</p>
	}
	


	return redirect ? (
		<p>Welcome. you are logged in as {user}</p>
	) : (
		<div>
			<Container style={{'textAlign': 'center'}}>
				<h1>Recruit Assistant</h1>
				<b>Sign In</b>
				
				<TextField label="Email" value={email} onChange={e=>setEmail(e.target.value)}></TextField>
				<br></br>
				<TextField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}></TextField>
				<br></br>
				{errorMessage}
				<Button onClick={handleSubmit}>Log In</Button>
				<br/>
			
				Don't have an account? <a href="/signup">Sign Up</a>
			</Container>
		</div>
	)
}

export default Login;