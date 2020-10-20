import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link, Button, Grid, Card, CardContent, CardActions, TextField} from "@material-ui/core";
import {Form, Col, Row} from 'react-bootstrap';
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
	const today = new Date()
	const href = `${window.location.href}`.split("/")
	const jobID = href[href.length - 1]
	const recruiterID = sessionStorage.getItem("uid")
	const history = useHistory();
	const [loading, setLoading] = useState(true);
	const [applications, setApplications] = useState([])
	const [inviteList, setInviteList] = useState([])
	const [job, setJob] = useState([])
	const [selection, setSelection] = useState()
	const [closingDate, setClosingDate] = useState('')

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
				setSelection(res.data.applications.length)
				console.log("response: ", res)
			})
			.catch((error) => {
				console.log("error: ", error.response)
			})
	};

	const handleDate = (date, jobseeker, index) => {
		var considering = [...inviteList]
		if (inviteList.length !== index + 1) {
			considering.push({ jobseeker_id: jobseeker })
		}
		considering[index]["date"] = date
		setInviteList(considering)
	}

	const handleTime = (time, jobseeker, index) => {
		var considering = [...inviteList]
		if (inviteList.length !== index + 1) {
			considering.push({ jobseeker_id: jobseeker })
		}
		considering[index]["time"] = time
		setInviteList(considering)
	}

	const datevalidator = (index) => {
		if (typeof inviteList[index] === "undefined") {
			return false
		} else if (inviteList[index]["date"] !== "" && today < Date.parse(inviteList[index]["date"])) {
			return true
		} else {
			return false
		}
	}

	const renderApplications = (selection, status) => {
		return applications.slice(0, selection).map((app, index) => (
			<Card style={{margin: 30, height: 225, width:550}}>
				<CardContent>                          
					<Grid>
						<Row>
							<Col>
								<Typography variant="h5" component="h2">
									{app[1].first_name} {app[1].last_name}
								</Typography>
								<Typography color="textSecondary">
									Meets {app[1].qualities_met} of the qualifications
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
				<CardActions>
					<Grid>
						<Col>
							<Row>
								<ButtonToolbar>
									<Button disabled = {status === "open"} variant="contained" color="secondary">Interview</Button>
									<Button disabled = {status === "open"} variant="contained" color="secondary">Offer</Button>
									<Button variant="contained" color="secondary">Dismiss</Button>
								</ButtonToolbar>
							</Row>
							<Row style = {{marginTop: 15, width: 500}}>
								<Form inline hidden = {status == "open"}>
										<Col style = {{marginLeft: 1, height: 25, width: 250}}>
											<Form.Group controlId="interview_date">
												<TextField 
													className={
														!datevalidator(index)
															? "form-control is-invalid"
															: "form-control"
													}
													required
													id="interview_date"
													type="date"
													min={today}
													onChange={ (event) => handleDate(event.target.value, app[1].jobseeker_id, index)}/>
													<Form.Control.Feedback type="invalid">
														Please enter a date in the future
													</Form.Control.Feedback>
											</Form.Group>
										</Col>
										<Col style = {{marginRight: 1, height: 25, width: 250}}>
											<Form.Group controlId="interview_time">
												<Form.Label>
													Time
												</Form.Label>
												<TextField
													required
													id="interview_time"
													type="time"
													onChange={ (event) => handleTime(event.target.value, app[1].jobseeker_id, index)}/>
											</Form.Group>
										</Col>
								</Form>	
							</Row>
						</Col>
					</Grid>
				</CardActions>
			</Card>
		))
	};

	return loading ? (
		<div></div>
	) : (
		job.map((detail) => (
			<Grid>
				<Row noGutters fluid><TitleBar/></Row>
				<Row noGutters style={{height:'100vh',paddingTop: 60}}>
					<Col sm="2">
						<SideMenu random={[
							{'text':'Job View','href': '#','active': false},
							{'text':'Applications','href': '#','active': true},
							{'text':'Interviews','href': '#','active': false},
							{'text':'Offers','href': '#','active': false},
							{'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': false},
							{'text':'FAQ','href':'#','active': false}]}/>
					</Col>

					<Col sm="9">
						<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
							{detail[1].title} @ {detail[1].company}
						</Typography>
						<Row>
							<Col sm = "8">
								<Form inline>
									<Form.Group controlId="selection" style ={{marginLeft:100}}>
										<Form.Label>Select top </Form.Label>
										<Form.Control
											required
											type = "number"
											disabled = {detail[1].status === "open"}
											onChange = { (event) => setSelection(event.target.value)}/>
									</Form.Group>
								</Form>
							</Col>
							<Col>
								<Button disabled = {detail[1].status === "open"} variant="contained" color="secondary"> Send Interview Invitations</Button>
							</Col>
						</Row>
						<Row>
							<div className="card-deck"  style={{ display: 'grid', flexWrap: 'wrap',justifyContent: 'normal', paddingLeft:'5%'}}>
								{renderApplications(selection, detail[1].status)}
							</div>
						</Row>
						
					</Col>
				</Row>
			</Grid>
		))
	);
}