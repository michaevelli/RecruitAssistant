import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import { Grid, Tab, Tabs, Typography, CircularProgress} from "@material-ui/core";
import {Col,Row, Card} from 'react-bootstrap';
import TabPanel from "./TabPanel.js"
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import { useHistory,Link } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const offerUrl="http://localhost:5000/offers"
export const searchUrl="http://localhost:5000/search/"
export const interviewUrl="http://localhost:5000/interviewlist"
export const applicationUrl="http://localhost:5000/pendingapplications"



export default function Offers() {
	const history = useHistory();
	const [loading, setLoading] = useState(true);
	//for applications tab loading
	const [loading_apps, setLoadingApps] = useState(true)
	const [offers, setOffers]=useState([])
	const [interviews, setInterviews]=useState([])
	const [applications, setApplications]=useState([])
	const [userID, setUserID] = useState('');
	
	//controls which tab is selected (tabs are labelled 0,1,2 from left to right)
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
	  setValue(newValue);
	};

	useEffect(() => {
		auth();
		getOffers();
		getInterviews();
		getApplications();
	}, [userID]); // eslint-disable-line react-hooks/exhaustive-deps

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				setLoading(false)				
				if (!response.success || response.userInfo["type"] !== "jobseeker") {
					return history.push("/unauthorised");
				}
				setUserID(response.userID)
				// if (response.userID != getOffers()) {
				// 	return history.push("/unauthorised");
				// }
				// setUserID(response.userID, getOffers()); 
			})
	}

	// --- database calls ---
	const getOffers = async () => {
		if (userID !== '') {
			const url = `${offerUrl}`
			console.log("userID = ", userID)
			const ndata = {
				// token: window.localStorage.getItem("token")
				userid: userID,
				type: "jobseeker"
			}
			
			await axios.post(url, ndata)
				.then(function(response) {
					console.log("response:", response.data)
					setOffers(response.data.offers)
					console.log(response.data.offers)
					return response.data.offers[1].jobseeker_id
				})
				.catch(function(error) {
					console.log(error.response)
				})
		}
		return null
		
	};

	const getInterviews = async () => {
		const url = `${interviewUrl}`
			
			const ndata = {
				token: window.localStorage.getItem("token")
			}
			
			axios.post(url, ndata)
				.then(function(response) {
					console.log("interview response:", response.data)
					setInterviews(response.data.interviews)
				})
				.catch(function(error) {
					console.log("error in interview")
					console.log(error.response)
				})
	};

	const getApplications = async () => {
		const url = `${applicationUrl}`
			
			const ndata = {
				token: window.localStorage.getItem("token")
			}
			
			axios.post(url, ndata)
				.then(function(response) {
					console.log("application response:", response.data)
					setApplications(response.data.applications)
				})
				.catch(function(error) {
					console.log("error in applications")
					console.log(error.response)
				})
				//move outside of promise, to prevent endless loading symbol
				setLoadingApps(false)
	};
	
	// --- render posts ---

	const renderOfferStatus = (offer) => {
		if (offer.status === "sent") {
			return <Card.Text>Congratulations, you have a job offer!</Card.Text>
		} else if (offer.status === "accepted") {
			return <Card.Text>You have accepted this offer!</Card.Text>
		} else if (offer.status === "declined") {
			return <Card.Text>You have declined this offer</Card.Text>
		} else if (offer.status === "countered") {
			return <Card.Text>Your counter offer is pending review</Card.Text>
		} else {
			return <Card.Text>(old status field)</Card.Text>
		}
	}

	const renderOffers = () => {
		return loading_apps===true? (
			<div style={{
				position: 'absolute', left: '50%', top: '50%',
				transform: 'translate(-50%, -50%)'
				}}>
				<CircularProgress/>
			</div>
		) : (offers.length===0? (
			<div style={{display:'flex',justifyContent:'center',marginTop:100}}> No offers yet. Fingers crossed!</div>
			) : (offers.map((offer) => (
			<div><div style={{display: 'flex', justifyContent: 'center'}}>
				<Card style={{width:"60%"}}>
					<Card.Body>
						<Row>
							<Col>
								<Card.Title>{offer[1].title}</Card.Title>
								<Card.Text>{offer[1].company} | {offer[1].job_type}</Card.Text>
								{renderOfferStatus(offer[1])}
							</Col>
							<Col style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
								<Link onClick={() => {history.push("/offer/"+offer[0])}}>View Offer</Link>
							</Col>
						</Row>
					</Card.Body>
				</Card>
			</div><br/></div>
		))))
	}

	const renderInterviewStatus = (interview) => {
		if (interview.status === "Pending") {
			return <Card.Text>You have an interview invite!</Card.Text>
		} else if (interview.status === "Accepted") {
			return <Card.Text>You have an interview on {interview.interview_date} at {interview.interview_time} </Card.Text>
		} else if (interview.status === "Declined") {
			return <Card.Text>You declined this interview</Card.Text>
		} else {
			return <Card.Text>(old status field)</Card.Text>
		}
	}

	const renderInterviews = () => {
		return loading_apps===true? (
			<div style={{
				position: 'absolute', left: '50%', top: '50%',
				transform: 'translate(-50%, -50%)'
				}}>
				<CircularProgress/>
			</div>
		) : (interviews.length===0? (
			<div style={{display:'flex',justifyContent:'center',marginTop:100}}> No interviews yet. Check back soon!</div>
			) : (interviews.map((interview) => (
			<div><div style={{display: 'flex', justifyContent: 'center'}}>
				<Card style={{width:"60%"}}>
					<Card.Body>
						<Row>
							<Col>
								<Card.Title>{interview[3].title}</Card.Title>
								<Card.Text>{interview[3].company} | {interview[3].job_type}</Card.Text>
								{renderInterviewStatus(interview[1])}
							</Col>
							<Col style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
								<Link onClick={() => {history.push("/interview/"+interview[0])}}>View Interview</Link>
							</Col>
						</Row>
					</Card.Body>
				</Card>
			</div><br/></div>
		))))
	}

	const renderAppStatus = (status) => {
		if (status === "pending") {
			return <Card.Text>Your application is being reviewed by the recruiter</Card.Text>
		} else if (status === "dismissed") {
			return <Card.Text>This application has been dismissed</Card.Text>
		} else if (status === "offer") {
			return <Card.Text>You have an offer for this application!</Card.Text>
		} else if (status === "interview") {
			return <Card.Text>You have an interview for this application!</Card.Text>
		} else {
			return <Card.Text>{status}</Card.Text>
		}
	}

	const renderApplications = () => {
		return loading_apps===true? (
			<div style={{
				position: 'absolute', left: '50%', top: '50%',
				transform: 'translate(-50%, -50%)'
				}}>
				<CircularProgress/>
			</div>
		) : (applications.length===0? (
			<div style={{display:'flex',justifyContent:'center',marginTop:100}}>No applications yet. Get applying!</div>
			) : (applications.map((application) => (
			<div><div style={{display: 'flex', justifyContent: 'center'}}>
				<Card style={{width:"60%"}}>
					<Card.Body>
						<Row>
							<Col>
								<Card.Title>{application[3].title}</Card.Title>
								<Card.Text>{application[3].company} | {application[3].job_type}</Card.Text>
								{renderAppStatus(application[1].status)}
							</Col>
							<Col style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
								
								<Link onClick={() => {history.push("/viewapplication/"+application[2]+"/"+application[0])}}>View Application</Link>
								
								&nbsp;&nbsp;&nbsp;
								
								<Link onClick={() => {history.push("/advertisement/"+application[2])}}>View Job</Link>
								
							</Col>
						</Row>
					</Card.Body>
				</Card>
			</div><br/></div>
		))))
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
			<Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 60}}>
				<Col sm={2}>
					<SideMenu random={[
						{'text':'Job Seeker Dashboard','href': '/jobseekerdashboard', 'active': false},
						{'text':'Your Applications','href': '/yourapplications', 'active': true},         
						{'text':'FAQ','href':'/jobseekerFAQ','active': false}]}/>
				</Col >
				<Col>	
					<Tabs
					centered
					value={value}
					indicatorColor="primary"
					textColor="primary"
					onChange={handleChange}
					style={{marginTop:10}}
					>
						<Tab label="Applications" style={{marginRight:200}}/>
						<Tab label="Interviews" />
						<Tab label="Offers"  style={{marginLeft:200}}/>
	  				</Tabs>
					  <TabPanel value={value} index={0}>
						<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
							Your Applications
						</Typography>
						{renderApplications()}
					</TabPanel>

					<TabPanel value={value} index={1} >
						<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
							Your Interviews
						</Typography>
						{renderInterviews()}
					</TabPanel>


					<TabPanel value={value} index={2} >
						<Typography variant="h4"  style={{color: 'black', textAlign: "center",marginTop:20, marginBottom:20 }}>
							Your Offers
						</Typography>
						{renderOffers()}
					</TabPanel>
				</Col>
			</Row>
		</Grid>
	);
}