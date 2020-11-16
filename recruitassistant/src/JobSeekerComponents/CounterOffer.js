import React, { useState } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {IconButton, Button, Snackbar} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close'
import {Form,Col} from 'react-bootstrap';
import axios from "axios";

export const counterofferurl="http://localhost:5000/counteroffer"

export default function CounterOffer(params) {
	const offerID = params.offerID;
	const closed = params.closed;
	const [openError, setOpenError] = useState(false)
	const [counterOffer,setCounterOffer] = useState('');

	async function handleSendCounter(e) {
		e.preventDefault()
		const data = { offerID: offerID, counteroffer: counterOffer }
		await axios.post(counterofferurl, data)
		.then(res => {
			console.log("response: ", res)
			window.location.reload();
		})
		.catch((error) => {
			console.log("error: ", error.response)
			setOpenError(true)
		})
	}

	if (closed === true) {
		return null
	}
	
	return (
		<div>
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				open={openError}
				autoHideDuration={5000}
				onClose={() => setOpenError(false)}
				message="An error occurred, please try again"
				action={
					<IconButton size="small" aria-label="close" color="inherit" onClick={() => setOpenError(false)}>
						<CloseIcon fontSize="small" />
					</IconButton>
				}
			/>
			<Form onSubmit={(e) => handleSendCounter(e)} style={{marginRight: 20}}>     
				<h4>Additional comments or counter offers</h4>
				<Form.Group controlId="description">
					<Col sm={10}>
						<Form.Control as="textarea" rows="10"
							required
							onChange={(e) => setCounterOffer(e.target.value)}/>
					</Col>
				</Form.Group>
				
				<Button variant="contained" color="secondary" type="submit" onSubmit={(e) => handleSendCounter(e)} style={{margin: 20}}>
					Send Counter-Offer
				</Button> 
			</Form>
		</div>
	);
}