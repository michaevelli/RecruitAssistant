import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import {Card, Container} from 'react-bootstrap';
import axios from "axios";

<<<<<<< HEAD
export const submitLogin="http://localhost:5000/login"
=======
export const submitLogin="http://127.0.0.1:5000/login"
>>>>>>> firebaseintegration

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorStatus, setErrorStatus] = useState("");
	const [errorMessage, setErrorMessage] = useState("");


	async function handleSubmit(e) {
		e.preventDefault()
		const ndata = {
			email: email,
			password: password
		}
<<<<<<< HEAD

=======
>>>>>>> firebaseintegration
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
				setErrorMessage(error.response.data.message)
				setErrorStatus("True")

			})

<<<<<<< HEAD
	}

=======
	  }
>>>>>>> firebaseintegration
	


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