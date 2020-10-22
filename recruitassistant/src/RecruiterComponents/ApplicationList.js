import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {IconButton, Button, Grid, Card, CardContent, CardActions, TextField} from "@material-ui/core";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import {Form, Col, Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import axios from "axios";
import {useHistory, Link} from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const advertisementUrl="http://localhost:5000/advertisement"
export const applicationUrl="http://localhost:5000/applicationslist"
export const interviewUrl="http://localhost:5000/interviews"


export default function RecruiterDashboard() {
	const today = new Date()
	const href = `${window.location.href}`.split("/")
	const jobID = href[href.length - 1]
	const recruiterID = sessionStorage.getItem("uid")
	const history = useHistory();
	const [loading, setLoading] = useState(true);
	const [applications, setApplications] = useState([])
	const [inviteList, setInviteList] = useState({})
	const [job, setJob] = useState([])
	const [selection, setSelection] = useState()

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
				initialise(res.data.applications)
				console.log("response: ", res)
			})
			.catch((error) => {
				console.log("error: ", error.response)
			})
	};

	const handleDate = (date, jobseeker, application) => {
		var considering = {...inviteList}
		if (!(jobseeker in considering)) {
			considering[jobseeker] = {app_id: application[0], date: "", time: ""}
		}
		considering[jobseeker]["date"] = date
		setInviteList(considering)
	}

	const handleTime = (time, jobseeker, application) => {
		var considering = {...inviteList}
		if (!(jobseeker in considering)) {
			considering[jobseeker] = {app_id: application[0], date: "", time: ""}
		}
		considering[jobseeker]["time"] = time
		setInviteList(considering)
	}

	const checkFormValidity = () => {
		if(selection > applications.length){
			return false
		}
		if (selection > 0) {
			for (let i = 0; i < selection; i++) {
				if (datevalidator(applications[i][1]["jobseeker_id"]) === false || timevalidator(applications[i][1]["jobseeker_id"]) === false) {
					return false
				}
			}
			return true
		} else {
			return false
		}
	}

	const postInterview = async () => {
		if (checkFormValidity() === true) {
			var invite_list = []
			var emp_id = sessionStorage.getItem("uid")
			console.log(applications.slice(0, selection))
			for (let i = 0; i < selection; i++) {
				const jobseeker = applications[i][1]["jobseeker_id"]
				invite_list.push({
					jobseeker_id: jobseeker,
					employer_id: emp_id,
					app_id: applications[i][0],
					job_id: jobID,
					date: inviteList[jobseeker]["date"],
					time: inviteList[jobseeker]["time"]
				})
			}

			const data={
				invite_list
			}

			await axios.post(interviewUrl, data)
			.then(res => {
				console.log("response: ", res)
				alert("Interview Successfully Sent")
			})
			.catch((error) => {
				console.log("error: ", error.response)
				alert("An error occured, please try again")
			})
		} else {
			alert("Please fill in all fields correctly with one or more applicants chosen")
		}
	};

	const datevalidator = (jobseeker) => {
		if (typeof jobseeker === "undefined" || jobseeker === "") {
			return false
	 	} else if (typeof inviteList[jobseeker] === "undefined") {
			return false
		} else if (inviteList[jobseeker]["date"] !== "" && typeof inviteList[jobseeker]["date"] !== "undefined" && today < Date.parse(inviteList[jobseeker]["date"])) {
			return true
		} else {
			return false
		}
	}

	const timevalidator = (jobseeker) => {
		if (typeof jobseeker === "undefined" || jobseeker === "") {
			return false
	 	} else if(typeof inviteList[jobseeker] === "undefined") {
			return false
		} else if (inviteList[jobseeker]["time"] !== "" && typeof inviteList[jobseeker]["time"] !== "undefined") {
			return true
		} else {
			return false
		}
	}

	const initialise = (applicationList) => {
		setApplications(applicationList)
		setSelection(applicationList.length)
		var considering = {...inviteList}
		for (let i = 0; i < applicationList.length; i++) {
			considering[applicationList[i][1]["jobseeker_id"]] = {app_id: applicationList[i][0], date: "", time: ""}
		}
		setInviteList(considering)
	}

	const moveAppUp = (index) => {
		var list = [...applications]
		var temp = applications[index - 1]
		list[index - 1] = applications[index]
		list[index] = temp
		setApplications(list)
	}

	const moveAppDown = (index) => {
		var list = [...applications]
		var temp = applications[index + 1]
		list[index + 1] = applications[index]
		list[index] = temp
		setApplications(list)
	}

	const renderApplications = (selection, status) => {
		return applications.slice(0, selection).map((app, index) => (
			<Grid>
				<Row>
					<Col>
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
											<Link to={`/viewapplication/${jobID}/${app[0]}`} style={{marginLeft: 90}} >
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
												<Button disabled = {status === "open"} variant="contained" color="secondary">
													<Link to={{
														pathname: `/createoffer`,
														state: {
															jobAppID: app[0],
															jobID: jobID}}}>
														Offer
													</Link>
												</Button>
												<Button variant="contained" color="secondary">Dismiss</Button>
											</ButtonToolbar>
										</Row>
										<Row style = {{marginTop: 15, width: 500}}>
											<Form inline hidden = {status == "open"}>
												<Col style = {{marginLeft: 1, height: 25, width: 250}}>
													<Form.Group controlId="interview_date">
														<TextField 
															className={
																!datevalidator(app[1].jobseeker_id)
																	? "form-control is-invalid"
																	: "form-control"
															}
															required
															id="interview_date"
															type="date"
															min={today}
															onChange={ (event) => handleDate(event.target.value, app[1].jobseeker_id, app)}/>
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
															className={
																!timevalidator(app[1].jobseeker_id)
																	? "form-control is-invalid"
																	: "form-control"
															}
															required
															id="interview_time"
															type="time"
															onChange={ (event) => handleTime(event.target.value, app[1].jobseeker_id, app)}/>
															<Form.Control.Feedback type="invalid">
																Please enter a time
															</Form.Control.Feedback>
													</Form.Group>
												</Col>
											</Form>	
										</Row>
									</Col>
								</Grid>
							</CardActions>
						</Card>
					</Col>
					<Col style = {{marginTop: 100}}>
						<IconButton disabled = {index === 0 || status === "open"} color="secondary" onClick = {() => moveAppUp(index)}>
							<KeyboardArrowUpIcon/>
						</IconButton>
						<IconButton disabled = {index === selection - 1 || status === "open"} color="secondary" onClick = {() => moveAppDown(index)}>
							<KeyboardArrowDownIcon/>
						</IconButton>
					</Col>
				</Row>
			</Grid>
		))
	};

	return loading ? (
		<div></div>
	) : (
		job.map((detail) => (
			<Grid>
				<Row noGutters fluid><TitleBar name={window.localStorage.getItem("name")}/></Row>
				<Row noGutters style={{height:'100vh',paddingTop: 60}}>
					<Col sm="2">
					<SideMenu random={[
							{'text':'Job View','href': '#','active': false,
							'nested':[
								{'text':'Applications','href': '#','active': true},
								{'text':'Interviews','href': '#','active': false},
								{'text':'Offers','href': '#','active': false},
							]},
							{'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': false},
							{'text':'FAQ','href':'/recruiterFAQ','active': false}
						]}/>
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
											min = {1}
											max = {applications.length}
											disabled = {detail[1].status === "open"}
											onChange = { (event) => setSelection(event.target.value)}/>
									</Form.Group>
								</Form>
							</Col>
							<Col>
								<Button disabled = {detail[1].status === "open"} variant="contained" color="secondary" onClick={() => {postInterview()}}> Send Interview Invitations</Button>
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