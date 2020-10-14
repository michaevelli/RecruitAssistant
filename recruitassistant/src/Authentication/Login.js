import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import {Card, Container} from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import axios from "axios";
import { useHistory, withRouter } from "react-router-dom";

export const submitLogin="http://localhost:5000/login"

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState("");
	const [redirect, setRedirect] = useState(false);
	const [errorStatus, setErrorStatus] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const history = useHistory();

	async function handleSubmit(e) {
		e.preventDefault()
		setErrorStatus(false)
		setErrorMessage("")
		const ndata = {
			email: email,
			password: password
		}
		console.log(ndata);
		
		axios.post(submitLogin, ndata)
			.then(function(response) {
				console.log("response:")
				console.log(response.data)
				window.localStorage.setItem("token", response.data.token)
				// window.localStorage.setItem("id", response.data.userID)
				// window.localStorage.setItem("company", response.data.user.company)
				// window.localStorage.setItem("email", response.data.user.email)
				// window.localStorage.setItem("first_name", response.data.user.first_name)
				// window.localStorage.setItem("last_name", response.data.user.last_name)
				window.localStorage.setItem("type", response.data.type)
				history.push("/"+window.localStorage.getItem("type")+"dashboard");
				// setRedirect(true)
				
			})
			.catch(function(error) {
				console.log(error.response)
				setErrorMessage(error.response.data.message)
				setErrorStatus(true)
			})
	}

	return (
		<div>
			<Container style={{'textAlign': 'center'}}>
				<h1>Recruit Assistant</h1>
				<b>Sign In</b>
				<br/>
				<TextField label="Email" value={email} error={errorStatus} onChange={e=>setEmail(e.target.value)}></TextField>
				<br/>
				<TextField label="Password" type="password" value={password} error={errorStatus} onChange={e=>setPassword(e.target.value)}></TextField>
				<br/>
				<div id="error" style={{color: 'red'}}>{errorMessage}</div>
				<Button onClick={handleSubmit}>Log In</Button>
				<br/>
			
				Don't have an account? <a href="/signup">Sign Up</a>
			</Container>
		</div>
	)
}

export default Login;