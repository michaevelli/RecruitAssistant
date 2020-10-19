import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link, Button, Grid,Card,CardContent,CardActions } from "@material-ui/core";
import {Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const advertisementUrl="http://localhost:5000/advertisement"
export const applicationUrl="http://localhost:5000/applicationslist"

export default function RecruiterDashboard() {
	const href = `${window.location.href}`.split("/")
	const jobID = href[href.length - 1]
	const recruiterID = sessionStorage.getItem("uid")
	const history = useHistory();
	const [loading, setLoading] = useState(true);
	const [applications, setApplications] = useState([])
	const [job, setJob] = useState([])
	const [qualifications, setQualifications] = useState()

	useEffect(() => {
		auth();
		getJob();
		getApplications();
	}, [recruiterID]);

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				setLoading(false)
				if (!response.success || response.userInfo["type"] != "recruiter") {
					history.push("/unauthorised");
				}
			})
	}

	const getJob = async () => {
		const url = `${advertisementUrl}`
		console.log(url)
		await axios.get(url, {
			params: {
				job_id: jobID
			},
		})
		.then(res => {
				setJob(res.data.job)
				setQualifications(res.data.job[0][1].qualifications.split(",").length)
				console.log("response: ", res)
			})
			.catch((error) => {
				console.log("error: ", error.response)
			})
	};

	const getApplications = async () => {
		const url = `${applicationUrl}`
		console.log(url)
		await axios.get(url, {
			params: {
				job_id: jobID
			},
		})
		.then(res => {
				setApplications(res.data.applications)
				console.log("response: ", res)
			})
			.catch((error) => {
				console.log("error: ", error.response)
			})
	};

	const renderApplications = () => {
		// var descending = {};
		// applications.map((app) => (
		// 	descending.set(app, qualifications - app[1].qualities_met)
		// ));
		// var items = Object.keys(descending).map(function(key) {
		// 	return [key, descending[key]]
		// });
		// items.sort(function(first, second) {
		// 	return second[1] - first[1];
		// });
		return applications.map((app) => (
			<Card style={{margin: 30, height: 180, width:550}}>
				<CardContent>                          
					<Grid>
						<Row>
							<Col>
								<Typography variant="h5" component="h2">
									{app[1].first_name} {app[1].last_name}
								</Typography>
							</Col>
							<Col>
								<Link href={`/application/${app[0]}`} style={{marginLeft: 90}} >
									View Application
								</Link>
							</Col>
						</Row>
					</Grid>
				</CardContent>
				<CardActions >
					<ButtonToolbar>
						<Button>Interview</Button>
						<Button>Offer</Button>
						<Button>Dismiss</Button>
					</ButtonToolbar>
				</CardActions>
			</Card>
		))
	}

	return loading ? (
		<div></div>
	) : (
		job.map((detail) => (
			<Grid>
				<Row noGutters fluid><TitleBar/></Row>
				<Row noGutters style={{height:'100vh',paddingTop: 60}}>
					<Col sm="2">
						<SideMenu random={[
							{'text':'Job View','href': '#','active': false,
							'text':'Applications','href': '#','active': true},
							{'text':'Interviews','href': '#','active': false},
							{'text':'Offers','href': '#','active': false},
							{'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': false},
							{'text':'FAQ','href':'#','active': false}]}/>
					</Col>

					<Col sm="9">
						<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
							{detail[1].title} @ {detail[1].company}
						</Typography>
						<Typography variant="h5"  style={{color: 'black', marginLeft:20 }}>
							Select top
						</Typography>
						<div className="card-deck"  style={{ display: 'grid', flexWrap: 'wrap',justifyContent: 'normal', paddingLeft:'5%'}}>
							{renderApplications()}
						</div>
					</Col>
						
					<Col>
						<Button variant="contained" color="secondary" href="/createJobPost" style={{position: 'fixed', right: 0, top: 40, margin: 30}}>
							+ Job
						</Button>               
					</Col>
				</Row>
			</Grid>
		))
	);
}