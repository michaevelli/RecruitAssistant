import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import {Card, Container} from 'react-bootstrap';


function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<div>
			<h1>Recruit Assistant</h1>
		
			Sign In

			<form>
				Email <input type="text"></input><br></br>
				Password <input type="password"></input><br></br>
				<button>Sign In</button>
			</form>
		
		
			Don't have an account? <a href="/signup">Sign Up</a>
			test
		</div>
	)
}

export default Login;