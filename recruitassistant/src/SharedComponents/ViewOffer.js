import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link, Grid} from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import {Col,Row, Button} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TitleBar from "./TitleBar.js";
import SideMenu from "./SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";
import CounterOffer from "../JobSeekerComponents/CounterOffer";

export const offerdetailsurl="http://localhost:5000/getOfferDetails"

export default function ViewOffer({match}) {
	const history = useHistory();
	const offerId = match.params.offerID
	const [offer, setOffer] = useState({})
	const [isRecruiter, setIsRecruiter] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		auth();
		getOffer();
	}, []);

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				if (!response.success) {
					history.push("/unauthorised");
				}
				if (response.userInfo["type"] == "recruiter") {
					setIsRecruiter(true)
				}
			})
	}

	const getOffer = async () => {
		const ndata = {
			offerId: offerId
		}
		axios.post(offerdetailsurl, ndata)
				.then(function(response) {
					console.log("response:", response.data)
					/*initialise(response.data)*/
					setOffer(response.data.offer)
					setLoading(false)
				})
				.catch(function(error) {
					console.log(error.response)
				})

	}

	const downloadFile = async (data,filename) =>{			
		const linkSource = data;
		const downloadLink = document.createElement("a");
		const fileName = filename;
	
		downloadLink.href = linkSource;
		downloadLink.download = fileName;
		downloadLink.click();		
	}

	// --- render components dynamically ---
	const renderDocumentItems = () => {
		if (offer.additional_docs == null) {
			return null
		} else {
			return (
				<Box fontSize="h6.fontSize" lineHeight={2}>
					Documentation:
						{offer.additional_docs.map((document) => (
						<ul>
							<Link style={{ cursor: 'pointer'}} onClick={()=>downloadFile(document.src,document.filename)} target="_blank">
								<PictureAsPdfIcon color = "secondary"/>{document.filename}
							</Link>
						</ul>
					))}
				</Box>
			)
		}
	}

	const renderAcceptButtons = () => {
		if (isRecruiter) {
			if (offer.status == 'accepted') {
				return <p>Offer has been accepted</p>
			} else if (offer.status == 'rejected') {
				return <p>Offer has been rejected</p>
			} else if (offer.status == 'sent') {
				return <p>Offer is pending response from applicant</p>
			} else if (offer.status == 'countered') {
				return (
					<div>
						<p>Additional comments/counter offer from applicant:</p>
						<p>{offer.counter_offer}</p>
						<Button variant="contained" color="secondary" onClick={handleEdit} style={{margin: 20}}>
							Edit Offer
						</Button>
						<Button variant="contained" color="secondary" onClick={handleDecline} style={{margin: 20}}>
							Decline Applicant
						</Button>
					</div>
				)
			}
		} else {
			if (offer.status == 'accepted') {
				return <p>You have accepted this offer!</p>
			} else if (offer.status == 'rejected') {
				return <p>You have declined this offer</p>
			} else if (offer.status == 'sent') {
				return (
					<div>
						<Button variant="contained" color="secondary" onClick={handleAccept} style={{margin: 20}}>
							Accept Offer
						</Button>
						<Button variant="contained" color="secondary" onClick={handleDecline} style={{margin: 20}}>
							Decline Offer
						</Button>
						<CounterOffer offerID={offerId}/>
					</div>
				)
			} else if (offer.status == 'countered') {
				return (
					<div>
						<p>Counter offer is pending response from recruiter</p>
						<p>Your counter offer:</p>
						{offer.counter_offer}
					</div>
				)
			}
		}
	}
	
	const renderDesc = () => {
		if (offer.description == null) {return null}
		var arr = offer.description.split("\n");
		var items = [];
		var i = 0;
		while (i < arr.length) {
			items.push(<div>{arr[i]}</div>);
			i = i + 1;
		}
		return items;
	}

	// --- event handlers ---
	const handleEdit = () => {
		history.push("/editoffer/"+offerId)
	}

	const handleAccept = () => {
		// history.push("/editoffer/"+offerId)
	}

	const handleDecline = () => {
		// history.push("/editoffer/"+offerId)
	}
	

	return loading ? (
		<div></div>
	) : (
		<Grid>      
			<Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 60}}>
				<Col sm={2}>
					<SideMenu random={[
						{'text':'Job Seeker Dashboard','href': '/jobseekerdashboard', 'active': false},
						{'text':'Your Applications','href': '/offers', 'active': true},         
						{'text':'FAQ','href':'/jobseekerFAQ','active': false}]}/>
				</Col >
				<Col>
					<Typography component="div" style={{color: 'black', margin: 50}}>
						<Box fontSize="h3.fontSize" fontWeight="fontWeightBold">
							Offer: {offer.title}
						</Box>
						<Box fontSize="h5.fontSize">
							Company: {offer.company}
						</Box>
						<Box fontSize="h8.fontSize">
							Date Posted: {offer.date_posted}
						</Box>
						<br/><br/>
						<Box fontSize="h7.fontSize">
							{renderDesc()}
						</Box>
						<br/><br/>
						<Box fontSize="h6.fontSize">
							Offer details:
						</Box>
						<Box fontSize="h8.fontSize">
							Job Type: {offer.job_type}
						</Box>
						<Box fontSize="h8.fontSize">
							Location: {offer.location}
						</Box>
						<Box fontSize="h8.fontSize">
							Salary: {offer.salary} {offer.salary_type}
						</Box>
						<Box fontSize="h8.fontSize">
							Start Date: {offer.start_date}
						</Box>
						<Box fontSize="h8.fontSize">
							End Date: {offer.end_date}
						</Box>
						<Box fontSize="h8.fontSize">
							Days: {offer.days}
						</Box>
						<Box fontSize="h8.fontSize">
							Hours: {offer.hours}
						</Box>
						<br/><br/>
						{renderDocumentItems()}
						{renderAcceptButtons()}
					</Typography>
					
				</Col>
			</Row>
		</Grid>
	);
}


