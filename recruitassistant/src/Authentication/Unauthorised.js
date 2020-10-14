import React from "react"
import { Button } from "@material-ui/core";
import { Container } from 'react-bootstrap';
import { useHistory } from "react-router-dom";

export default function Unauthorised() {
	const history = useHistory();

	const handleBack = () => {
		history.go(-2);
	}

	const handleLogin = () => {
		window.localStorage.clear()
		history.push('/login')
	}

	return (
		<div>
			<br/>
			<Container style={{'textAlign': 'center'}}>
				<div>You don't have permission to view this page</div>
				<Button onClick={handleBack}>Go back</Button>
				<Button onClick={handleLogin}>Login</Button>
			</Container>
		</div>
	)
}