import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link, Button, Grid, CircularProgress, Typography } from "@material-ui/core";
import {Col,Row,Card, Container} from 'react-bootstrap';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const jobUrl="http://localhost:5000/jobadverts/"

export default function RecruiterDashboard() {
	const recruiterID = sessionStorage.getItem("uid")
	const history = useHistory();
	const [loading, setLoading] = useState(true);
	const [loadingJobs, setLoadingJobs] = useState(true);
	const [jobs, setJobs] = useState([])

	useEffect(() => {
		auth();
		getJobs();
	}, [recruiterID]); // eslint-disable-line react-hooks/exhaustive-deps

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				setLoading(false)
				if (!response.success || response.userInfo["type"] !== "recruiter") {
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
				setLoadingJobs(false)
				console.log("response: ", res)
			})
			.catch((error) => {
				console.log("error: ", error.response)
			})
	};

	function truncateText(text) {
		if (text.length > 180) {
			return text.slice(0, 180) + "..."
		}
		return text
	}

	const renderJobs = () => {
		return loadingJobs ? (
			<div style={{
				position: 'absolute', left: '50%', top: '50%',
				transform: 'translate(-50%, -50%)'
				}}>
				<CircularProgress/>
			</div>
		) : (
			jobs.length===0? (
			<div style={{display:'flex',justifyContent:'center',marginTop:100}}>
				You have no jobs posted. Click 'Create a Job' to get started!
			</div>
		) : (jobs.map((job) => (
			<div><div style={{display: 'flex', justifyContent: 'center'}}>
				<Card style={{width:"80%", height:"200px"}} >
					<Card.Body>
						<Row>
							<Col>
								<Card.Title><Link href={"/advertisement/"+job[0]}>{job[1].title}</Link></Card.Title>
								<Card.Text style={{fontStyle: 'italic'}}>{job[1].company} | {job[1].location} | {job[1].job_type}</Card.Text>
								<Card.Text>{truncateText(job[1].description)}</Card.Text>
							</Col>
							<Col xs={4}>
								<div style={{textAlign:'right'}}>
									{job[1].status === "open" ? 
											<Card.Text>Closing date: {job[1].closing_date}</Card.Text> :
											<Card.Text style={{color:'red'}}>This job is closed</Card.Text>
									}
									<Link href={"/editjob/"+job[0]}>
										Edit Job
									</Link><br/><br/>
									<Link href={`/applications/${job[0]}`}>
										View Applications
									</Link>
								</div>
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
			<Row noGutters fluid><TitleBar name={window.localStorage.getItem("name")}/></Row>
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
					<Container>{renderJobs()}</Container>
				</Col>
					
				<Col>
					<Button href="/createJobPost" 
						style={{position: 'fixed', minHeight: 55, right: 5, bottom: 40, margin: 30, borderRadius: 30, color: '#FFF'}}
						startIcon={<AddCircleIcon/>}
						color="primary"
						variant="contained"
						size="medium">
						Create a Job
					</Button>
				</Col>
			</Row>
		</Grid>
	);
}