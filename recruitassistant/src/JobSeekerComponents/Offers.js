import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Slider, Grid ,TextField,FormControl,InputLabel,MenuItem,Select} from "@material-ui/core";
// Card,CardContent,Button,CardActions
import {Form,Container,Col,Row,Collapse, Card, Button} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from "./TabPanel.js"
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import { useHistory,Link } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";
import Unauthorised from "../Authentication/Unauthorised";

export const offerUrl="http://localhost:5000/offers"
export const searchUrl="http://localhost:5000/search/"
export const interviewUrl="http://localhost:5000/interviewlist"
export const applicationUrl="http://localhost:5000/pendingapplications"



export default function Offers() {
	const history = useHistory();
	const [loading, setLoading] = useState(true);
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
	}, [userID]);

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				setLoading(false)				
				if (!response.success || response.userInfo["type"] != "jobseeker") {
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
	};
	
	// --- render posts ---
	// const renderOffers = () => {
	// 	return offers.map((offer) => (
	// 		<Card style={{margin: 30, height: 160, width:250}}>
	// 			<CardContent>                          
	// 				<Typography variant="h5" component="h2">
	// 					{offer[1].title}
	// 				</Typography>
	// 				<Typography color="textSecondary">
	// 					{offer[1].company} | {offer[1].location}
	// 				</Typography>
	// 			</CardContent>
	// 			<CardActions >
	// 				<Typography color="textSecondary">
	// 					Status: {offer[1].status}
	// 				</Typography>
	// 				<Link to={{pathname: `/offer/${offer[0]}`}} style={{marginLeft: 30}}>
	// 						View Offer
	// 				</Link>
	// 			</CardActions>
	// 		</Card>
	// 	))
	// }

	// const renderInterviews = () => {
	// 	return interviews.map((interview) => (
	// 		<Card style={{margin: 30, height: 160, width:250}}>
	// 			<CardContent>                          
	// 				<Typography variant="h5" component="h2">
	// 					{interview[3].title}
	// 				</Typography>
	// 				<Typography color="textSecondary">
	// 					{interview[3].company} | {interview[3].location}
	// 				</Typography>
	// 			</CardContent>
	// 			<CardActions >
	// 				<Typography color="textSecondary">
	// 					{interview[1].status}
	// 				</Typography>
					
	// 				<Link style={{marginLeft: 30}} 
	// 						to={{pathname: `/interview/${interview[0]}`}}
	// 						>
	// 						View Interview
	// 				</Link>
	// 			</CardActions>
	// 		</Card>
	// 	))
	// }

	const renderAppStatus = (status) => {
		if (status === "active") {
			return <Card.Text>Your application is being reviewed by the recruiter</Card.Text>
		} else {
			return <Card.Text>else</Card.Text>
		}
	}

	const renderAppButtons = (status, application) => {
		if (status === "active") {
			return (
				<div>
					<Button onClick={() => {history.push("/viewapplication/"+application[2]+"/"+application[0])}}>View Application</Button>
					&nbsp;&nbsp;&nbsp;
					<Button onClick={() => {history.push("/advertisement/"+application[2])}}>View Job</Button>
				</div>
			)
		} else {
			return <Card.Text>else</Card.Text>
		}
	}

	const renderApplications = () => {
		console.log(applications)
		return applications.map((application) => (
			<Card>
				<Card.Body>
					<Row>
						<Col>
							<Card.Title>{application[3].title}</Card.Title>
							<Card.Text>{application[3].job_type} | {application[3].company}</Card.Text>
						</Col>
						<Col>
							<div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
								{renderAppStatus(application[1].status)}
							</div>
						</Col>
						<Col>
							<div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
								{renderAppButtons(application[1].status, application)}
							</div>
						</Col>
					</Row>
				</Card.Body>
			</Card>
			// <Card>
			// 	<CardContent>                          
			// 		<Typography variant="h5" component="h2">
			// 			{application[3].title}
			// 		</Typography>
			// 		<Typography color="textSecondary">
			// 			{application[3].company} | {application[3].location}
			// 		</Typography>
			// 	</CardContent>
			// 	<CardActions >
			// 		<Link to={{pathname: `/viewapplication/${application[2]}/${application[0]}`}} style={{marginLeft: 30}}>
			// 			View Application
			// 		</Link>
			// 	</CardActions>
			// </Card>
		))
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
						<div className="card-deck"  style={{ display: 'flex', flexWrap: 'wrap',justifyContent: 'normal', paddingLeft:'5%'}}>
							{renderApplications()}
						</div>
					</TabPanel>

					<TabPanel value={value} index={1} >
						<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
							Your Interviews
						</Typography>
						<div className="card-deck"  style={{ display: 'flex', flexWrap: 'wrap',justifyContent: 'normal', paddingLeft:'5%'}}>
							{/* {renderInterviews()} */}
						</div>
					</TabPanel>


					<TabPanel value={value} index={2} >
						<Typography variant="h4"  style={{color: 'black', textAlign: "center",marginTop:20, marginBottom:20 }}>
							Your Offers
						</Typography>
						<div className="card-deck"  style={{ display: 'flex', flexWrap: 'wrap',justifyContent: 'normal', paddingLeft:'5%'}}>
							{/* {renderOffers()} */}
						</div>
					</TabPanel>
				</Col>
			</Row>
		</Grid>
	);
}