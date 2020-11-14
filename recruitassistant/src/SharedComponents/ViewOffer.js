import React, { useState,useLayoutEffect,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link, Grid,Button, CircularProgress, Snackbar, IconButton, Divider} from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import CloseIcon from '@material-ui/icons/Close';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import {Col,Row,Alert,Card,Table} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TitleBar from "./TitleBar.js";
import SideMenu from "./SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";
import CounterOffer from "../JobSeekerComponents/CounterOffer";
import { DesktopWindows } from "@material-ui/icons";
export const offerdetailsurl="http://localhost:5000/getOfferDetails"
export const accepturl = "http://localhost:5000/acceptoffer"
export const declineurl = "http://localhost:5000/declineoffer"
export const updateurl = "http://localhost:5000/updateoffer"

//so page refresh restarts at the top of the page
document.documentElement.scrollTop = 0
document.body.scrollTop = 0

export default function ViewOffer({match}) {
	const history = useHistory();
	const offerId = match.params.offerID

	const [isRecruiter, setIsRecruiter] = useState(false)
	const [offer, setOffer] = useState({})
	const [desc, setDesc] = useState('')
	const [variant, setVariant]=useState('')
	const [counter_offer_shown, setCounterOfferShown]= useState('none')
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);

	useEffect(() => {
		auth();	
		getOffer();
	},[]);

	useLayoutEffect(() => {
		updateAlert()
	},[offer,isRecruiter]);

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
		await axios.post(offerdetailsurl, ndata)
				.then(function(response) {
					console.log("response:", response.data)
					/*initialise(response.data)*/
					setOffer(response.data.offer)
					
				}).catch(function(error) {
					console.log(error.response)
					//page not found
					history.push("/*")
				})	
				setLoading(false)

	}
	const updateAlert = ()=>{
		if(offer.status==='accepted'){
			setVariant('success')	
			setDesc(isRecruiter? "Offer has been accepted!":"You have accepted this offer!")
		}
		else if(offer.status==='declined'){
			console.log(isRecruiter)
			setVariant('dark')
			setDesc(isRecruiter?"The candidate has declined this offer.":"You have declined this offer.")
		}
		else if(offer.status==='countered'){
			setVariant('primary')
			setDesc(isRecruiter? "Please respond to the candidate's counter offer.":"Counter offer is pending response from recruiter.")
		}
		else{
			setVariant('danger')
			setDesc(isRecruiter?"Awaiting candidate response.":"Please respond to this offer.")
		}
		setOpen(true)
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
				<Typography variant='body1'>
					Documents:
					{offer.additional_docs.map((document) => (
						<ul>
							<Link style={{ cursor: 'pointer'}} onClick={()=>downloadFile(document.src,document.filename)} target="_blank">
								<PictureAsPdfIcon color = "secondary"/>{document.filename}
							</Link>
						</ul>
					))}
				</Typography>
			)
		}
	}

	const renderAcceptButtons = () => {
		
		if (isRecruiter) {
			if (offer.status === 'countered') {
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
			 if (offer.status === 'sent') {
				return (
					<div>
						<Button variant="contained" color="secondary" onClick={handleAccept} style={{marginRight:20}}>
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
							<br/><CounterOffer  offerID={offerId}/>
						</div>
					</div>
				)
			} else if (offer.status === 'countered') {
				return (
					<div>
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
				window.location.reload();
			})
			.catch((error) => {
				console.log("error: ", error.response)
				setOpenSnackbar(true)
			})
	}

	const handleDecline = () => {
		const ndata = { offer_id: offerId, status: "declined" }
		axios.post(updateurl, ndata)
			.then(() => {
				window.location.reload();
				//setDesc("This offer has been declined.")
			})
			.catch((error) => {
				console.log("error: ", error.response)
				setOpenSnackbar(true)
			})
	}
	
	const recruiterMenu = () => {
		console.log(history)
		return (		
			<SideMenu random={[
				{'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': false},
				{'text': offer.title,'href': '#','active': false,
				'nested':[
					{'text':'Applications','href': `/applications/${offer.job_id}`,'active': false},
					{'text':'Interviews','href': `/interviews/${offer.job_id}`,'active': false},
					{'text':'Offers','href': `/offers/${offer.job_id}`,'active': true},
					{'text': 'Statistics','href': `/jobstatistics/${offer.job_id}`,'active': false}
					]},
				{'text':'FAQ','href':'/recruiterFAQ','active': false}]}/>
		);
	}
	const jobseekerMenu = () => {
		return (		
		<SideMenu random={[
			{'text':'Job Seeker Dashboard','href': '/jobseekerdashboard', 'active': false},
			{'text':'Your Applications','href': '/yourapplications', 'active': true},         
			{'text':'FAQ','href':'/jobseekerFAQ','active': false}]}/>	
		);
	}

	return loading ? (
		<div style={{
			position: 'absolute', left: '50%', top: '50%',
			transform: 'translate(-50%, -50%)'
			}}>
			<CircularProgress/>
		</div>
	) : (
		<Grid>      
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				open={openSnackbar}
				autoHideDuration={5000}
				onClose={() => setOpenSnackbar(false)}
				message="An error occurred, please try again"
				action={
					<IconButton size="small" aria-label="close" color="inherit" onClick={() => setOpenSnackbar(false)}>
						<CloseIcon fontSize="small" />
					</IconButton>
				}
			/>
			<Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 60}}>
				<Col sm={2}>
					{ isRecruiter? recruiterMenu(): jobseekerMenu()}
				</Col >
				<Col>
					<Row>
						<Col xs={1}></Col>
						<Col xs={6}>
							<Alert style={{visibility: (open? 'visible':'hidden'), margin:10}}  variant={variant} >
								{desc}
							</Alert>
							<Typography component="div" style={{color: 'black', margin: 50}}>
								<Typography variant='h5'>{offer.title}</Typography>
								<Typography variant='subtitle1'>{offer.company}</Typography>
								<Typography variant='subtitle1'>Date Posted: {offer.date_posted}</Typography>
								<br/>
								<Divider/>
								<br/>
								<Typography variant='body1'>{renderDesc()}</Typography>
							</Typography>
							<br/>
							{renderDocumentItems()}
							<br/>
							{renderAcceptButtons()}
						</Col>
						<Col xs={5} style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
							<Row style={{height:400,width:'60%',position:'absolute', top:80}}>
								<Card border='success'style={{width:'100%'}}>
									<Card.Body>
										<Card.Title>Offer Details</Card.Title>
										<Table borderless hover>
											<tbody>
												<tr><td>Location: </td><td>{offer.location}</td></tr>
												<tr><td>Job Type: </td><td>{offer.job_type}</td></tr>
												<tr><td>Salary: </td><td>${offer.salary} {offer.salary_type}</td></tr>
												<tr><td>Start Date: </td><td>{offer.start_date}</td></tr>
												<tr><td>End Date: </td><td>{offer.end_date}</td></tr>
												<tr><td>Days: </td><td>{offer.days}</td></tr>
												<tr><td>Hours: </td><td>{offer.hours}</td></tr>
											</tbody>
										</Table>
									</Card.Body>
								</Card>
							</Row>
						</Col>
					</Row>
				</Col>
			</Row>
		</Grid>
	);
}


