import React, { useState, useEffect } from "react";
import { TextField, Button, CircularProgress, InputAdornment, Typography } from "@material-ui/core";
import { AccountCircle,Lock } from "@material-ui/icons";
import {Container, Col, Row} from 'react-bootstrap';
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";
import logo from '../SharedComponents/Picture2.png';

export const submitLogin="http://localhost:5000/login"

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
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
				window.localStorage.setItem("refreshToken", response.data.refreshToken)
				window.localStorage.setItem("name", response.data.name)
				history.push("/"+response.data.type+"dashboard");
			})
			.catch(function(error) {
				console.log(error.response)
				if (error.response == null) {
					setErrorMessage("Error: Backend server not running!")
				} else {
					setErrorMessage(error.response.data.message)
				}
				setErrorStatus(true)
			})
	}

	return loading ? (
		<div style={{
			position: 'absolute', left: '50%', top: '50%',
			transform: 'translate(-50%, -50%)'
			}}>
			<CircularProgress/>
		</div>
	) : (
		<Container style={{backgroundColor:'white'}} fluid>
			<Row style={{height: '100vh'}}>
				<Col xs={5} style={{display:'flex', justifyContent:'center', alignItems:'center',backgroundColor:'#348360'}}>
					<Row style={{display:'flex', justifyContent:'center', color:'white'}}>
						<img src={logo} style={{ width:'80%', height:'auto'}}/>
						<br/>
						<h4 style={{textAlign:'center', width:'100%', height:'auto'}}>
							Connect with the right people.</h4>
					</Row>
				</Col>
				<Col xs={7} style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
					<Button onClick={() => {history.push('/')}} style={{position:'absolute', top:30, left:30}}>
						Home
					</Button>					
					<div style={{width:'50%', textAlign:'center'}}>
					<Row style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
						<Typography variant="h6" style={{color: 'grey'}}>
							Welcome to RecruitAssistant
						</Typography>
						<br/><br/><br/>
					</Row>
					<Row>
						<div style={{width:'100%', textAlign:'center'}}>
						<form onSubmit={handleSubmit}>
							<TextField fullWidth
								value={email} 
								error={errorStatus}
								placeholder="Email"
								onChange={e=>setEmail(e.target.value)}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<AccountCircle />
										</InputAdornment>
									),
								}}/>
							<br/><br/>
							<TextField fullWidth
								placeholder="Password"
								type="password" 
								value={password} 
								error={errorStatus} 
								onChange={e=>setPassword(e.target.value)}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Lock/>
										</InputAdornment>
									),
								}}/>
							<br/><br/>
							<div id="error" style={{color: 'red'}}>{errorMessage}</div>
							<br/>
							<Button type="submit"variant="contained" 
								style={{backgroundColor:'#348360', width:'100%', color:'white', borderRadius:15}}>
								Log In
							</Button>
						</form>
						<br/>
						Don't have an account? <a href="/signup">Sign Up</a>
						</div>
					</Row>
					</div>
				</Col>
			</Row>
		
		</Container>
	)
}

export default Login;