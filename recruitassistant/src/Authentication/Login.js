import React, { useState, useEffect } from "react";
import { TextField, Button } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import {Card, Container} from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import axios from "axios";
import { useHistory, withRouter } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";
import logo from '../SharedComponents/Picture2.png'; 
export const submitLogin="http://localhost:5000/login"

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	// const [user, setUser] = useState("");
	// const [redirect, setRedirect] = useState(false);
	const [errorStatus, setErrorStatus] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const history = useHistory();

	useEffect(() => {
		auth();
	}, []);

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				setLoading(false)
				if (response.success) {
					history.push("/"+response.userInfo["type"]+"dashboard");
				}
			})
	}

	async function handleSubmit(e) {
		e.preventDefault()
		setErrorStatus(false)
		setErrorMessage("")

		const ndata = {
			email: email,
			password: password
		}
		
		axios.post(submitLogin, ndata)
			.then(function(response) {
				console.log("response:", response.data)
				window.localStorage.setItem("token", response.data.token)
				history.push("/"+response.data.type+"dashboard");
			})
			.catch(function(error) {
				console.log(error.response)
				setErrorMessage(error.response.data.message)
				setErrorStatus(true)
			})
	}

	return loading ? (
		<div></div>
	) : (
		<div>
			<Container style={{'textAlign': 'center'}}>
				<img src={logo} style={{ width:400, height:100, marginBottom:10,marginTop:20, marginLeft:20}}></img>
				<br/>
				<br/>
				<form onSubmit={handleSubmit}>
					<TextField label="Email" value={email} error={errorStatus} onChange={e=>setEmail(e.target.value)}></TextField>
					<br/>
					<TextField label="Password" type="password" value={password} error={errorStatus} onChange={e=>setPassword(e.target.value)}></TextField>
					<br/>
					<div id="error" style={{color: 'red'}}>{errorMessage}</div>
					<Button type="submit"
					variant="contained" style={{margin:25}}>Log In</Button>
				</form>
				<br/>
			
				Don't have an account? <a href="/signup">Sign Up</a>
			</Container>
		</div>
	)
}

export default Login;