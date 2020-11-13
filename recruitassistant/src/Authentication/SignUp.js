import React, { useState, useEffect } from "react";
import { TextField, Button, CircularProgress, InputAdornment, Typography } from "@material-ui/core";
import { Work, People } from "@material-ui/icons";
import {Container, Col, Row} from 'react-bootstrap';
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";
import logo from '../SharedComponents/Picture2.png';

export const submitSignUp="http://localhost:5000/signup"

function SignUp() {
	const history = useHistory();
	const [type, setType] = useState('');
	const [first_name, setFirstName] = useState("");
	const [last_name, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repassword, setRepassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	async function handleSubmit(e) {
		e.preventDefault()

		if (password !== repassword) {
			setErrorMessage("Passwords do not match")
			return false
		}
		const ndata = {
			first_name: first_name,
			last_name: last_name,
			email: email,
			password: password,
			type: type
		}
		console.log(ndata)
		axios.post(submitSignUp, ndata).then(function(response) {
			console.log("response:", response)
			alert("successfully created account")
			history.push("/login")
		})
		.catch(function(error){
			console.log("error:", error.response)
			const msg=error.response.data.message
			if (msg ==="Error while calling Auth service (INVALID_EMAIL)."){
				setErrorMessage("Invalid email address.")
			}else if(msg==="The user with the provided email already exists (EMAIL_EXISTS)."){
				setErrorMessage("This email already exists.")
			}else{
				setErrorMessage(msg)
			}
		})
	}

	return (
		<Container style={{backgroundColor:'white'}} fluid>
			<Row style={{height: '100vh'}}>
				<Col xs={5} style={{backgroundColor:'#348360'}}>
					<Row style={{position:'absolute',left:'10%',top:'30%',color:'white'}}>
						<img src={logo} style={{ width:500, height:125}}></img>
						<br/>
						<h3 style={{position:'absolute', top:100, left:100, width:400}}>Connect with the right people.</h3>
					</Row>
				</Col>
				<Col xs={7} style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
					<Button onClick={() => {history.push('/login')}} style={{position:'absolute', top:30, left:30}}>
						Login
					</Button>					
					<div style={{width:'50%', textAlign:'center'}}>
						<Row style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
							<Typography variant="h6" style={{color: 'grey'}}>
								{type==='' ? "I am a ..." : (type==='jobseeker' ? "Job Seeker" : "Recruiter")}
							</Typography>
							<br/><br/><br/><br/>
						</Row>
						<Row style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
							{type==='' ? (
								<div style={{width:'100%', display:'flex', justifyContent:'center'}}>
									<Button variant="contained" 
										style={{backgroundColor:'#348360', width:'50%', color:'white', borderRadius:50}}
										onClick={() => {setType('jobseeker')}}>
										<Work/>&nbsp;&nbsp;&nbsp;Job Seeker
									</Button>
									<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<Button variant="contained" 
										style={{backgroundColor:'#348360', width:'50%', color:'white', borderRadius:50}}
										onClick={() => {setType('recruiter')}}>
										<People/>&nbsp;&nbsp;&nbsp;Recruiter
									</Button>
								</div>
							) : (
								<form onSubmit={handleSubmit}>
									<TextField required
										variant='outlined'
										value={first_name} 
										placeholder="First Name"
										onChange={e=>setFirstName(e.target.value)}/>
									<TextField required
										variant='outlined'
										value={last_name} 
										placeholder="Last Name"
										onChange={e=>setLastName(e.target.value)}/>
									<br/>
									<TextField fullWidth required
										variant='outlined'
										value={email} 
										placeholder="Email"
										onChange={e=>setEmail(e.target.value)}/>
									<br/>
									<TextField fullWidth required
										variant='outlined'
										placeholder="Password"
										type="password" 
										value={password}
										onChange={e=>setPassword(e.target.value)}/>
									<br/>
									<TextField fullWidth required
										variant='outlined'
										placeholder="Re-enter Password"
										type="password" 
										value={repassword}
										onChange={e=>setRepassword(e.target.value)}/>
									<br/><br/>
									<div id="error" style={{color: 'red'}}>{errorMessage}</div>
									<br/>
									<Button type="submit"variant="contained" 
										style={{backgroundColor:'#348360', width:'40%', color:'white', borderRadius:30}}>
										Sign Up
									</Button>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<Button variant="contained" 
										style={{width:'40%', borderRadius:30}}
										onClick={() => {
											setType("");
											setFirstName("");
											setLastName("");
											setEmail("");
											setPassword("");
											setRepassword("");
											setErrorMessage("");
											}}>
										Cancel
									</Button>
								</form>
							)}
						</Row>
					</div>
				</Col>
			</Row>
		
		</Container>
	)
}

export default SignUp;

