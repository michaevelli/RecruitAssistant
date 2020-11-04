import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link, Grid,Button} from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import {Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TitleBar from "./TitleBar.js";
import SideMenu from "./SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";
import CounterOffer from "../JobSeekerComponents/CounterOffer";

export const offerdetailsurl="http://localhost:5000/getOfferDetails"
export const accepturl = "http://localhost:5000/acceptoffer"
export const declineurl = "http://localhost:5000/declineoffer"
export const updateurl = "http://localhost:5000/updateoffer"

export default function ViewOffer({match}) {
	const history = useHistory();
	const offerId = match.params.offerID
	const [offer, setOffer] = useState({})
	const [isRecruiter, setIsRecruiter] = useState(false)
	const [loading, setLoading] = useState(true)
	const [counter_offer_shown, setCounterOfferShown]= useState('none')

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
				return <p style={{fontStyle: "italic", color: 'red'}}>You have accepted this offer!</p>
			} else if (offer.status == 'declined') {
				return <p style={{fontStyle: "italic", color: 'red'}}>You have declined this offer</p>
			} else if (offer.status == 'sent') {
				return (
					<div>
						<Button variant="contained" color="secondary" onClick={handleAccept} style={{marginRight: 20}}>
							Accept Offer
						</Button>
						<Button variant="contained" color="secondary" onClick={handleDecline} style={{margin: 20}}>
							Decline Offer
						</Button>

						{offer.counterable && 
						<Button variant="contained" 
						color="secondary" 
						onClick={() => setCounterOfferShown( 
						counter_offer_shown==='none'? 'block': 'none')} 
						style={{margin: 20}}>
							Counter Offer
						</Button>}
						<div style={{display: counter_offer_shown}}>
						<CounterOffer  offerID={offerId}/>
						</div>
					</div>
				)
			} else if (offer.status == 'countered') {
				return (
					<div>
						<p style={{fontStyle: "italic", color: 'red'}}>Counter offer is pending response from recruiter</p>
						<Typography variant="h6" gutterBottom>
							Your counter offer:</Typography>
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
		history.push("/editoffer/"+offer.job_id+"/"+offerId)
	}

	const handleAccept = () => {
		const ndata = { offer_id: offerId, status: "accepted" }
		axios.post(updateurl, ndata)
			.then(() => {
				alert("Accepted offer!");
				window.location.reload();
			})
			.catch((error) => {
				console.log("error: ", error.response)
				alert("An error occured, please try again")
			})
	}

	const handleDecline = () => {
		const ndata = { offer_id: offerId, status: "rejected" }
		axios.post(updateurl, ndata)
			.then(() => {
				alert("Declined offer");
				window.location.reload();
			})
			.catch((error) => {
				console.log("error: ", error.response)
				alert("An error occured, please try again")
			})
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
						<Box fontSize="h3.fontSize" >
							Offer:  {offer.title}
						</Box>
						<Box fontSize="h6.fontSize">
							Company:  {offer.company}
						</Box>
						<Box fontSize="h6.fontSize">
							Date Posted:  {offer.date_posted}
						</Box>
						<br/><br/>
						<Box fontSize="h7.fontSize" fontStyle="italic">
							{renderDesc()}
						</Box>
						<br/><br/>
						<Box fontSize="h6.fontSize">
							Offer details:
						</Box>
						<br/>
						
						<Box fontSize="h8.fontSize">
							<span style={{"font-weight": 'bold'}}>Job Type:</span> {offer.job_type}
						</Box>
						<Box fontSize="h8.fontSize">
						<span style={{"font-weight": 'bold'}}>Location:</span> {offer.location}
						</Box>
						<Box fontSize="h8.fontSize">
						<span style={{"font-weight": 'bold'}}>Salary:</span> {offer.salary} {offer.salary_type}
						</Box>
						<Box fontSize="h8.fontSize">
						<span style={{"font-weight": 'bold'}}>Start Date:</span> {offer.start_date}
						</Box>
						<Box fontSize="h8.fontSize">
						<span style={{"font-weight": 'bold'}}>End Date:</span> {offer.end_date}
						</Box>
						<Box fontSize="h8.fontSize">
						<span style={{"font-weight": 'bold'}}>Days:</span> {offer.days}
						</Box>
						<Box fontSize="h8.fontSize">
						<span style={{"font-weight": 'bold'}}>Hours:</span>	{offer.hours}
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


