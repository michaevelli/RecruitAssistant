import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link, Button, Grid,Card,CardContent,CardActions } from "@material-ui/core";
import {Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";
// import SendInterview from "./SendInterview.js";

export const jobUrl="http://localhost:5000/jobadverts/"

export default function RecruiterDashboard() {
	// var recruiterID = "1234";
	const recruiterID = sessionStorage.getItem("uid")
	const history = useHistory();
	const [loading, setLoading] = useState(true);
	const [jobs, setJobs] = useState([])

	useEffect(() => {
		auth();
		getJobs();
	}, [recruiterID]);

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				setLoading(false)
				// const recruiterID = sessionStorage.getItem("uid")			
				if (!response.success || response.userInfo["type"] != "recruiter") {
					history.push("/unauthorised");
				}
			})
	}

	const getJobs = async () => {
		const url = `${jobUrl}${recruiterID}`
		console.log(url)
		await axios.get(url)
			.then(res => {
				setJobs(res.data.jobs)
				console.log("response: ", res)
			})
			.catch((error) => {
				console.log("error: ", error.response)
			})
	};

	const renderJobs = () => {
		return jobs.map((job) => (
			<Card style={{margin: 30, height: 180, width:280}}>
				{/* <Card.Body> */}
				<CardContent>                          
					<Typography variant="h5" component="h2">{job[1].title}</Typography>
					<Typography color="textSecondary">{job[1].company} | {job[1].location}</Typography>
					<Typography color="textSecondary">{job[1].status}</Typography>
				</CardContent>
				<CardActions >
					<Typography 
					style={ (job[1].status=='open')? 
					{color: 'green', marginRight:10} : {color:'red',marginRight:10}}>
						{job[1].status}
					</Typography>

					<Link href={"/editjob/"+job[0]} style={{marginLeft: 10}} >
						Edit Job
					</Link>
					
					<Link href={`/applications/${job[0]}`} style={{marginLeft: 10}} >
						View Applications
					</Link>
				</CardActions>
				{/* </Card.Body> */}
			</Card>
		))
	}

	return loading ? (
		<div></div>
	) : (
		<Grid>
			<Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 60}}>
				<Col sm="2">
					<SideMenu random={[
						{'text':'Recruiter Dashboard','href': '#','active': true},
						{'text':'FAQ','href':'/recruiterFAQ','active': false}]}/>
				</Col>

				<Col sm="9">
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						Your Jobs
					</Typography>
					<div className="card-deck"  style={{ display: 'flex', flexWrap: 'wrap',justifyContent: 'normal', paddingLeft:'5%'}}>
						{renderJobs()}
					</div>
				</Col>
					
				<Col>
					<Button variant="contained" color="secondary" href="/createJobPost" style={{position: 'fixed', right: 0, top: 40, margin: 30}}>
						+ Job
					</Button>      
					{/* <SendInterview></SendInterview> */}
				</Col>
			</Row>
		</Grid>
	);
}