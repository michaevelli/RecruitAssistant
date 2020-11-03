import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {IconButton,Grid,Button,TextField} from "@material-ui/core";
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import {Form,Container,InputGroup,Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const counterofferurl="http://localhost:5000/counteroffer"

export default function CounterOffer(params) {
	const offerID = params.offerID;
	const closed = params.closed;
	const [counterOffer,setCounterOffer] = useState('');

	async function handleSendCounter(e) {
		e.preventDefault()
		const data = { offerID: offerID, counteroffer: counterOffer }
		await axios.post(counterofferurl, data)
		.then(res => {
			console.log("response: ", res)
			alert("Comments/counter offer successfully sent")
			// history.push("/recruiterdashboard")
		})
		.catch((error) => {
			console.log("error: ", error.response)
			alert("An error occured, please try again")
		})
	}

	if (closed === true) {
		return null
	}
	
	return (
		<Form onSubmit={(e) => handleSendCounter(e)} style={{marginLeft:'15%'}}>     
			<h4>Additional comments or counter offers</h4>
			<Form.Group controlId="description">
				<Col sm={10}>
					<Form.Control as="textarea" rows="10" 
						onChange={(e) => setCounterOffer(e.target.value)}/>
				</Col>
			</Form.Group>
			
			<Button variant="contained" color="secondary" type="submit" onSubmit={(e) => handleSendCounter(e)} style={{margin: 20}}>
				Send Counter-Offer
			</Button> 
		</Form>
	);
}