import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import {Card, Container} from 'react-bootstrap';
import axios from "axios";

export const submitLogin="http://127.0.0.1:5000/login"

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");


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
				//store appropriate response data in localstorage
				//redirect to dashboard
			})
			.catch(function(error){
				console.log("error:")
				console.log(error.response)
				//add to html to display error
			})

	  }
	


	return (
		<div>
			<Container style={{'textAlign': 'center'}}>
				<h1>Recruit Assistant</h1>
				<b>Sign In</b>

				<form onSubmit={handleSubmit}>
					<TextField id="email" label="Email" value={email} onChange={e=>setEmail(e.target.value)}></TextField>
					<br></br>
					<TextField id="password" label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}></TextField>
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