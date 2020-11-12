import React from "react"
import { Button } from "@material-ui/core";
import { Container } from 'react-bootstrap';
import { useHistory } from "react-router-dom";

export default function NotFound() {
	const history = useHistory();

	return (
		<div>
			<br/><br/><br/><br/><br/><br/><br/><br/><br/>
			<Container style={{'textAlign': 'center'}}>
				<div>404: Page not found.</div>
				<Button onClick={() => {history.push("/")}}>Home</Button>
			</Container>
		</div>
	)
}