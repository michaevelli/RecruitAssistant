import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {IconButton, Button, ButtonGroup, Grid, CardContent, CardActions, TextField} from "@material-ui/core";
//Card
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Form, Col, Row, Card} from 'react-bootstrap';
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
export const dismissUrl="http://localhost:5000/dismiss"

export default function ApplicationList({match}) {
	const today = new Date()
	const jobID = match.params.jobID;
	const recruiterID = sessionStorage.getItem("uid")
	const history = useHistory();
	const [loading, setLoading] = useState(true);
	const [loadingApps, setLoadingApps] = useState(true);
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
		console.log(jobID)
		const url = `${applicationUrl}`
		await axios.get(url, {
			params: {
				job_id: jobID
			},
		})
			.then(res => {
				initialise(res.data.applications)
				setLoadingApps(false)
				// console.log("applications: ", res.data.applications)
				// console.log("response: ", res)
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
			return "You have selected more applications than there are available. Please enter a valid number."
		}
		if (selection > 0) {
			for (let i = 0; i < selection; i++) {
				if (datevalidator(applications[i][1]["jobseeker_id"]) === false || timevalidator(applications[i][1]["jobseeker_id"]) === false) {
					return "Invalid date or time entered. Please check these fields are valid and try again."
				}
			}
			return "true"
		} else {
			return "You have selected an invalid number of applications. Please enter a valid number."
		}
	}

	const removeApp = (index) => {
		var apps = [...applications]
		apps.splice(index, 1)
		setApplications(apps)
		if (selection > apps.length) {
			setSelection(apps.length)
		}
	};

	const dismiss = async (app, index) => {
		const data={
			job_id: jobID,
			app_id: app[0]
		}
		await axios.patch(dismissUrl, data)
		.then(res => {
			console.log("response: ", res)
			removeApp(index)
			alert(app[1]["first_name"] + " " + app[1]["last_name"] + "'s application dismissed")
		})
		.catch((error) => {
			console.log("error: ", error.response)
			alert("An error occured, please try again")
		})
	};

	const postInterview = async (app) => {
		if (datevalidator(app[1]["jobseeker_id"]) === true && timevalidator(app[1]["jobseeker_id"]) === true) {
			var invite_list = []
			var emp_id = sessionStorage.getItem("uid")
			console.log("application: ", app)
			const jobseeker = app[1]["jobseeker_id"]
			invite_list.push({
				jobseeker_id: jobseeker,
				employer_id: emp_id,
				app_id: app[0],
				job_id: jobID,
				first_name: app[1]["first_name"],
				last_name: app[1]["last_name"],
				date: inviteList[jobseeker]["date"],
				time: inviteList[jobseeker]["time"]
			})

			const data={
				invite_list
			}

			await axios.post(interviewUrl, data)
			.then(res => {
				console.log("response: ", res)
				alert("Interview Successfully Sent")
				window.location.reload()
			})
			.catch((error) => {
				console.log("error: ", error.response)
				alert("An error occured, please try again")
			})
		} else {
			alert("Please fill in all fields correctly for " + app[1]["first_name"] + " " + app[1]["last_name"])
		}
	};

	const postInterviews = async () => {
		let res = checkFormValidity()
		if (res === "true") {
			var invite_list = []
			var emp_id = sessionStorage.getItem("uid")
			console.log("applications: ", applications.slice(0, selection))
			for (let i = 0; i < selection; i++) {
				const jobseeker = applications[i][1]["jobseeker_id"]
				invite_list.push({
					jobseeker_id: jobseeker,
					employer_id: emp_id,
					app_id: applications[i][0],
					job_id: jobID,
					first_name: applications[i][1]["first_name"],
					last_name: applications[i][1]["last_name"],
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
			alert(res)
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
		var considering = {...inviteList}
		for (let i = 0; i < applicationList.length; i++) {
			considering[applicationList[i][1]["jobseeker_id"]] = {app_id: applicationList[i][0], date: "", time: ""}
		}
		setInviteList(considering)
		setSelection(applicationList.length)
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

	// const renderAppStatus = (status) => {
	// 	if (status === "pending") {
	// 		return <Card.Text>This application is pending review</Card.Text>
	// 	} else if (status == "dismissed") {
	// 		return <Card.Text>This application has been dismissed</Card.Text>
	// 	} else if (status == "offer") {
	// 		return <Card.Text>You have made an offer to this applicant</Card.Text>
	// 	} else if (status == "interview") {
	// 		return <Card.Text>You sent an interview invite to this applicant</Card.Text>
	// 	} else {
	// 		return <Card.Text>{status}</Card.Text>
	// 	}
	// }

	const renderApplications = (status) => {
		if (loadingApps) {
			return (
				<div style={{
					position: 'absolute', left: '50%', top: '50%',
					transform: 'translate(-50%, -50%)'
					}}>
					<CircularProgress/>
				</div>
			)
		}
		if( applications.length==0){
			return (
				<div style={{display:'flex',justifyContent:'center',marginTop:100}}>
					There are no pending applications. Check back soon!
				</div>)
		}
		if (selection > 0) {
			return applications.slice(0, selection).map((app, index) => (
			// 	<div><div style={{display: 'flex', justifyContent: 'center'}}>
			// 	<Card style={{width:"80%", height:"200px"}}>
			// 		<Card.Body>
			// 			<Row>
			// 				<Col xs={8}>
			// 					<Card.Title><Link to={"/viewapplication/"+jobID+'/'+app[0]}>{app[1].first_name} {app[1].last_name}</Link></Card.Title>
			// 					<Card.Text style={{fontStyle: 'italic'}}>Meets {app[1].qualities_met} of the qualifications</Card.Text>
			// 					{renderAppStatus(app[1].status)}
			// 				</Col>
			// 				<Col>
			// 					<ButtonGroup
			// 						orientation="vertical"
			// 						color="primary"
			// 						aria-label="vertical contained primary button group"
			// 						variant="text"
			// 					>
			// 						<Button variant="contained" disabled = {status === "open"} onClick={() => {postInterview(app)}}>Send Interview</Button>
			// 						<Button variant="contained">
			// 							<Link style={{color: '#FFF'}} to={{pathname: `/createoffer`,
			// 								state: {
			// 									jobAppID: app[0],
			// 									jobID: jobID}}}>
			// 								Send Offer
			// 							</Link>
			// 						</Button>
			// 						<Button variant="contained" onClick={() => {dismiss(app, index)}}>Dismiss</Button>
			// 					</ButtonGroup>
								
			// 				</Col>
			// 			</Row>
			// 			<Row style = {{marginTop: 15, width: 500}}>
			// 				<Form inline hidden = {status == "open"}>
			// 					<Col style = {{marginLeft: 1, height: 25, width: 250}}>
			// 						<Form.Group controlId={"interview_date_" + app[0]}>
			// 							<TextField 
			// 								className={
			// 									!datevalidator(app[1].jobseeker_id)
			// 										? "form-control is-invalid"
			// 										: "form-control"
			// 								}
			// 								required
			// 								id={"interview_date_" + app[0]}
			// 								type="date"
			// 								min={today}
			// 								value={inviteList[app[1].jobseeker_id]["date"]}
			// 								onChange={ (event) => handleDate(event.target.value, app[1].jobseeker_id, app)}/>
			// 								<Form.Control.Feedback type="invalid">
			// 									Please enter a date in the future
			// 								</Form.Control.Feedback>
			// 						</Form.Group>
			// 					</Col>
			// 					<Col style = {{marginRight: 1, height: 25, width: 250}}>
			// 						<Form.Group controlId={"interview_time_" + app[0]}>
			// 							<Form.Label>
			// 								Time
			// 							</Form.Label>
			// 							<TextField
			// 								className={
			// 									!timevalidator(app[1].jobseeker_id)
			// 										? "form-control is-invalid"
			// 										: "form-control"
			// 								}
			// 								required
			// 								id={"interview_time_" + app[0]}
			// 								type="time"
			// 								value={inviteList[app[1].jobseeker_id]["time"]}
			// 								onChange={ (event) => handleTime(event.target.value, app[1].jobseeker_id, app)}/>
			// 								<Form.Control.Feedback type="invalid">
			// 									Please enter a time
			// 								</Form.Control.Feedback>
			// 						</Form.Group>
			// 					</Col>
			// 				</Form>	
			// 			</Row>
			// 		</Card.Body>
			// 	</Card>
			// 	<Col style={{display: 'flex', justifyContent: 'center'}}>
			// 		<IconButton disabled = {index === 0 || status === "open"} color="secondary" onClick = {(event) => moveAppUp(index, event)}>
			// 			<KeyboardArrowUpIcon/>
			// 		</IconButton>
			// 		<IconButton disabled = {index === selection - 1 || index === applications.length - 1 || status === "open"} color="secondary" onClick = {(event) => moveAppDown(index, event)}>
			// 			<KeyboardArrowDownIcon/>
			// 		</IconButton>
			// 	</Col>
			// </div><br/></div>
				// <Grid>
					<Row>
						<Col>
							<Card style={{margin: 30, height: 225, width:"100%"}}>
								<Card.Body>                          
									<Grid>
										<Row>
											<Col xs={8}>
												<Card.Title><Link to={"/viewapplication/"+jobID+'/'+app[0]}>{app[1].first_name} {app[1].last_name}</Link></Card.Title>
												<Card.Text style={{fontStyle: 'italic'}}>Meets {app[1].qualities_met} of the qualifications</Card.Text>
											</Col>
											<Col xs={4}>
												<div style={{display:'flex', justifyContent:'center', flexWrap: 'wrap'}}>
													<Button disabled = {status === "open"} 
													variant="outline" 
													style={{width:'80%', marginBottom:5, borderRadius:15}}
													onClick={() => {postInterview(app)}}> 
															Interview
													</Button><br/>
													<Button variant="contained" 
													color="secondary" 
													style={{width:'80%', marginBottom:5, borderRadius:15}}>
														<Link style={{color: '#FFF'}} to={{
															pathname: `/createoffer`,
															state: {
																jobAppID: app[0],
																jobID: jobID}}}>
															Offer
														</Link>
													</Button><br/>
													<Button style={{width:'80%', marginBottom:5, borderRadius:15}} 
													variant="contained" 
													color="secondary" 
													onClick={() => {dismiss(app, index)}}>
														Dismiss
													</Button>
												</div>
											</Col>
										</Row>
									</Grid>
								</Card.Body>
								<Card.Body>
									<Grid>
										<Col>
											{/* <Row>
												<ButtonToolbar>
													<Button disabled = {status === "open"} 
													variant="contained" 
													color="secondary"
													style={{marginRight:10, margnLeft:10}}
													onClick={() => {postInterview(app)}}> 
															Interview
													</Button>
													<Button variant="contained" 
													color="secondary" 
													style={{marginRight:10, margnLeft:10}}>

														<Link style={{color: '#FFF'}} to={{
															pathname: `/createoffer`,
															state: {
																jobAppID: app[0],
																jobID: jobID}}}>
															Offer
														</Link>
													</Button>
													<Button variant="contained" color="secondary" onClick={() => {dismiss(app, index)}}>Dismiss</Button>
												</ButtonToolbar>
											</Row> */}
											<Row style = {{marginTop: 15, width: 500}}>
												<Form inline hidden = {status == "open"}>
													<Col style = {{marginLeft: 1, height: 25, width: 250}}>
														<Form.Group controlId={"interview_date_" + app[0]}>
															<TextField 
																className={
																	!datevalidator(app[1].jobseeker_id)
																		? "form-control is-invalid"
																		: "form-control"
																}
																required
																id={"interview_date_" + app[0]}
																type="date"
																min={today}
																value={inviteList[app[1].jobseeker_id]["date"]}
																onChange={ (event) => handleDate(event.target.value, app[1].jobseeker_id, app)}/>
																<Form.Control.Feedback type="invalid">
																	Please enter a date in the future
																</Form.Control.Feedback>
														</Form.Group>
													</Col>
													<Col style = {{marginRight: 1, height: 25, width: 250}}>
														<Form.Group controlId={"interview_time_" + app[0]}>
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
																id={"interview_time_" + app[0]}
																type="time"
																value={inviteList[app[1].jobseeker_id]["time"]}
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
								</Card.Body>
							</Card>
						</Col>
						<Col style = {{marginTop: 100}}>
							<IconButton disabled = {index === 0 || status === "open"} color="secondary" onClick = {(event) => moveAppUp(index, event)}>
								<KeyboardArrowUpIcon/>
							</IconButton>
							<IconButton disabled = {index === selection - 1 || index === applications.length - 1 || status === "open"} color="secondary" onClick = {(event) => moveAppDown(index, event)}>
								<KeyboardArrowDownIcon/>
							</IconButton>
						</Col>
					</Row>
				// {/* </Grid> */}
			))
		}
		
	};

	return loading ? (
		<div style={{
			position: 'absolute', left: '50%', top: '50%',
			transform: 'translate(-50%, -50%)'
			}}>
			<CircularProgress/>
		</div>
	) : (
		job.map((detail) => (
			<Grid>
				<Row noGutters fluid><TitleBar name={window.localStorage.getItem("name")}/></Row>
				<Row noGutters style={{height:'100vh',paddingTop: 60}}>
					<Col sm="2">
					<SideMenu random={[
							{'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': false},
							{'text': detail[1].title,'href': '#','active': false,
							'nested':[
								{'text':'Applications','href': '#','active': true},
								{'text':'Interviews','href': `/interviews/${jobID}`,'active': false},
								{'text':'Offers','href': `/offers/${jobID}`,'active': false},
							]},
							{'text':'FAQ','href':'/recruiterFAQ','active': false}
						]}/>
					</Col>

					<Col sm="10">
						<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
							{detail[1].title}
						</Typography>
						<Typography variant="h6"  style={{color: 'black', textAlign: "center",margin:20 }}>
							{detail[1].company} | 
							{detail[1].status==="open"? (' Closing date: '+detail[1].closing_date) : ' This job has closed'}
						</Typography>
						<Row>
							<Col sm = "8">
								<Form inline>
									<Form.Group controlId="selection" style ={{ marginLeft:100}}>
										<Form.Label>Select top </Form.Label>
										<Form.Control
											required
											type = "number"
											min = {1}
											style={{width:80,margin:10}}
											max = {applications.length}
											placeholder='X'
											disabled = {detail[1].status === "open"}
											onChange = { (event) => setSelection(event.target.value)}/>
									</Form.Group>
									  applicants
								</Form>
							</Col>
							<Col style={{display: 'flex', justifyContent: 'center'}}>
								<Button disabled = {detail[1].status === "open"} 
								variant="contained" color="secondary"
								style={{borderRadius: 30}}
								onClick={() => {postInterviews()}}> Send Interview Invitations</Button>
							</Col>
						</Row>
						<Row style={{display: 'flex', justifyContent: 'center'}}>
							{renderApplications(detail[1].status)}
							{/* <div className="card-deck"  style={{ display: 'grid', flexWrap: 'wrap',justifyContent: 'normal', paddingLeft:'5%'}}>
								{renderApplications(detail[1].status)}
							</div> */}
						</Row>
					</Col>
				</Row>
			</Grid>
		))
	);
}