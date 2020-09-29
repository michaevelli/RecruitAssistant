import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import {Card, Container} from 'react-bootstrap';


function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (event) => {
		event.preventDefault();

		/*
		Send to backend:
			${email}
			${password}	
		Expect to receive a token to store in browser followed by redirection to home page
		*/
	}

	


	return (
		<div>
			<h1>Recruit Assistant</h1>
		
			Sign In

			<form onSubmit={handleSubmit}>
				<label>Email</label>
				<input id="email" type="text" value={email} onChange={e=>setEmail(e.target.value)}></input>
				<br></br>
				<label>Password</label>
				<input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)}></input>
				<br></br>
				<input type="submit" value="Log In"></input>
			</form>
		
		
			Don't have an account? <a href="/signup">Sign Up</a>
		</div>
	)
}

export default Login;