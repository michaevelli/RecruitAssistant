import React, { useState } from "react";
import { TextField, Button, IconButton, Snackbar } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close'
import {Container} from 'react-bootstrap';
import axios from "axios";
import { useHistory } from "react-router-dom";
import logo from '../SharedComponents/Picture2.png'; 

export const submitSignUp="http://localhost:5000/signup"

function SignUpRecruiter() {
	const [first_name, setFirstName] = useState("");
	const [last_name, setLastName] = useState("");
	const [company, setCompany] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repassword, setRepassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [open, setOpen] = useState(false)
	const [disable, setDisable] = useState(false)
	const history = useHistory();

	function validateForm(){
	
	}
	async function handleSubmit(e) {
		e.preventDefault()
		
		if (password !== repassword) {
			setErrorMessage("Passwords do not match")
			return false
		}
	
		const ndata = {
			first_name: first_name,
			last_name: last_name,
			company: company,
			email: email,
			password: password,
			type: "recruiter"
		}
		console.log(ndata)
		axios.post(submitSignUp, ndata).then(function(response) {
			console.log("response:", response)
			setOpen(true)
			setDisable(true)
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

	const handleClose = () => {
		setOpen(false)
		history.push("/login")
	}

	return (
		<div>
			<Container style={{'textAlign': 'center'}}>
				<img src={logo} style={{ width:400, height:100, marginBottom:20,marginTop:20, marginLeft:20}}></img>

				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					open={open}
					autoHideDuration={5000}
					onClose={() => handleClose()}
					message="Account successfully created"
					action={
						<IconButton size="small" aria-label="close" color="inherit" onClick={() => handleClose()}>
							<CloseIcon fontSize="small" />
						</IconButton>
					}
				/>

				<form onSubmit={handleSubmit}>
					<TextField label="First Name" required value={first_name} onChange={e=>setFirstName(e.target.value)}/>
					<br/>
					<TextField label="Last Name" required value={last_name} onChange={e=>setLastName(e.target.value)}/>
					<br/>
					<TextField label="Company" required value={company} onChange={e=>setCompany(e.target.value)}/>
					<br/>
					<TextField label="Email" required value={email} onChange={e=>setEmail(e.target.value)}/>
					<br/>
					<TextField label="Password" required type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
					<br/>
					<TextField label="Re-enter password" required type="password" value={repassword} onChange={e=>setRepassword(e.target.value)}/>
					<br/>
					<div id="error" style={{color: 'red'}}>{errorMessage}</div>
					<Button disabled={disable} type="submit" variant="contained" style={{margin:20}}> Sign Up </Button>
				</form>
			</Container>
		</div>
	)
}

export default SignUpRecruiter;