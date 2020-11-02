import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link,Slider, Grid,Card,CardContent,Button,CardActions ,TextField,FormControl,InputLabel,MenuItem,Select} from "@material-ui/core";
import {Form,Container,Col,Row,Collapse} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

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
    

    useEffect(() => {
		auth();
		getOffers();
		getInterviews();
		getApplications();
    }, []);

    const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				setLoading(false)				
				if (!response.success || response.userInfo["type"] != "jobseeker") {
					history.push("/unauthorised");
				}
			})
	}

	const getOffers = async () => {
		const url = `${offerUrl}`
            
            const ndata = {
                token: window.localStorage.getItem("token")
            }
            
            axios.post(url, ndata)
                .then(function(response) {
					console.log("offer response:", response.data)
					setOffers(response.data.offers)
                })
                .catch(function(error) {
					
                    console.log(error.response)
                })
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
    
    const renderOffers = () => {
		return offers.map((offer) => (
			<Card style={{margin: 30, height: 160, width:250}}>
				<CardContent>                          
					<Typography variant="h5" component="h2">
						{offer[1].title}
					</Typography>
					<Typography color="textSecondary">
						{offer[1].company} | {offer[1].location}
					</Typography>
				</CardContent>
				<CardActions >
					<Typography color="textSecondary">
						{offer[1].job_type}
					</Typography>
					<Link href= {`/offer/${offer[0]}`} style={{marginLeft: 30}}>
							View Offer
					</Link>
				</CardActions>
			</Card>
		))
	}

	const renderInterviews = () => {
		return interviews.map((interview) => (
			<Card style={{margin: 30, height: 160, width:250}}>
				<CardContent>                          
					<Typography variant="h5" component="h2">
						{interview[3].title}
					</Typography>
					<Typography color="textSecondary">
						{interview[3].company} | {interview[3].location}
					</Typography>
				</CardContent>
				<CardActions >
					<Typography color="textSecondary">
						{interview[1].interview_date}, {interview[1].interview_time}
					</Typography>
					<Link href= {``} style={{marginLeft: 30}}>
							View Interview
					</Link>
				</CardActions>
			</Card>
		))
	}

	const renderApplications = () => {
		return applications.map((application) => (
			<Card style={{margin: 30, height: 160, width:250}}>
				<CardContent>                          
					<Typography variant="h5" component="h2">
						{application[3].title}
					</Typography>
					<Typography color="textSecondary">
						{application[3].company} | {application[3].location}
					</Typography>
				</CardContent>
				<CardActions >
					<Typography color="textSecondary">
						{application[3].job_type}
					</Typography>
					<Link href= {`/applications/${application[2]}`} style={{marginLeft: 30}}>
							View Application
					</Link>
				</CardActions>
			</Card>
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
						{'text':'Job Seeker Dashboard','href': 'jobseekerdashboard', 'active': false},
						{'text':'Your Applications','href': 'offers', 'active': true},         
						{'text':'FAQ','href':'#','active': false}]}/>
				</Col >
				<Col>	
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						Your Offers
					</Typography>
					<div className="card-deck"  style={{ display: 'flex', flexWrap: 'wrap',justifyContent: 'normal', paddingLeft:'5%'}}>
						{renderOffers()}
					</div>
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						Your Interviews
					</Typography>
					<div className="card-deck"  style={{ display: 'flex', flexWrap: 'wrap',justifyContent: 'normal', paddingLeft:'5%'}}>
						{renderInterviews()}
					</div>
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						Your Applications
					</Typography>
					<div className="card-deck"  style={{ display: 'flex', flexWrap: 'wrap',justifyContent: 'normal', paddingLeft:'5%'}}>
						{renderApplications()}
					</div>
				</Col>
			</Row>
		</Grid>
	);
}