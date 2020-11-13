import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {IconButton, Button, Grid, Snackbar, TextField} from "@material-ui/core";
//Card
import CloseIcon from '@material-ui/icons/Close'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Form, Col, Row, Card, Modal} from 'react-bootstrap';
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
	const [open, setOpen] = useState(false)
	const [message, setMessage] = useState('')
	const [disable, setDisable] = useState(false)
	const [email, setEmail] = useState('')
	
	//there is one modal per application on the page
	//showing is a dictionary with value being whether or not a
	//particular model is open currently
	//form: {appID: true/false}
	const [showing, setShowing] = useState({});
	//for controlling modals
	const handleClose = (appid) => {
		console.log("handle close for ",appid)
		var l= {...showing}
		l[appid]=false
		setShowing({...l})
		console.log(l)
	}
	const handleShow = (appid) =>{
		console.log("handle show for ",appid)
		var l= {...showing}
		l[appid]=true
		setShowing({...l})
		console.log(l)
	}

	//controls if we render the send to top page or not...
	const [sendTop,setSendTop]=useState(false)

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
				if (!response.success || response.userInfo["type"] !== "recruiter") {
					history.push("/unauthorised");
				}
				setEmail(response.userInfo["email"])
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
		}).then(res => {
				initialise(res.data.applications)
				setLoadingApps(false)
				console.log("applications: ", res.data.applications)
				// console.log("response: ", res)
			})
			.catch((error) => {
				console.log("error: ", error.response)
			})
	};

	const handleDate = (date, jobseeker, application) => {
		var considering = {...inviteList}
		if (!(jobseeker in considering)) {
			considering[jobseeker] = {app_id: application[0], date: "", time: "", details: ""}
		}
		considering[jobseeker]["date"] = date
		setInviteList(considering)
	}

	const handleTime = (time, jobseeker, application) => {
		var considering = {...inviteList}
		if (!(jobseeker in considering)) {
			considering[jobseeker] = {app_id: application[0], date: "", time: "", details: ""}
		}
		considering[jobseeker]["time"] = time
		setInviteList(considering)
	}

	const handleDetails = (details, jobseeker, application) => {
		var considering = {...inviteList}
		if (!(jobseeker in considering)) {
			considering[jobseeker] = {app_id: application[0], date: "", time: "", details: ""}
		}
		considering[jobseeker]["details"] = details
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

	const handleCloseSnackbar = (reason) => {
		setOpen(false)
		if (message.includes("Interview successfully sent for")) {
			window.location.reload()
			//Close dialog box
			// handleClose(app[0])
		}
	}

	const dismiss = async (app, index) => {
		const data={
			job_id: jobID,
			app_id: app[0]
		}
		await axios.patch(dismissUrl, data)
		.then(res => {
			console.log("response: ", res)
			removeApp(index)
			setMessage(app[1]["first_name"] + " " + app[1]["last_name"] + "'s application dismissed")
			setOpen(true)
		})
		.catch((error) => {
			console.log("error: ", error.response)
			setMessage("An error occured, please try again")
			setOpen(true)
		})
	};

	const postInterview = async (event, app) => {
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
				time: inviteList[jobseeker]["time"],
				details: inviteList[jobseeker]["details"],
				recruiter_email: email
			})

			const data={
				invite_list
			}

			await axios.post(interviewUrl, data)
			.then(res => {
				console.log("response: ", res)
				setDisable(true)
				setMessage("Interview successfully sent for " + app[1]["first_name"] + " " + app[1]["last_name"])
				setOpen(true)

			})
			.catch((error) => {
				console.log("error: ", error.response)
				setMessage("An error occured, please try again")
				setOpen(true)
			})
		} else {
			setMessage("Please fill in all fields correctly for " + app[1]["first_name"] + " " + app[1]["last_name"])
			setOpen(true)
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
					time: inviteList[jobseeker]["time"],
					details: inviteList[jobseeker]["details"],
					recruiter_email: email
				})
			}
			const data={
				invite_list
			}

			await axios.post(interviewUrl, data)
			.then(res => {
				console.log("response: ", res)
				setMessage(selection + " interviews successfully sent")
				setOpen(true)
				//hide this page again
				setSendTop(false)
			})
			.catch((error) => {
				console.log("error: ", error.response)
				setMessage("An error occured, please try again")
				setOpen(true)
			})
		} else {
			setMessage(res)
			setOpen(true)
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
		var initialise_showing={}
		for (let i = 0; i < applicationList.length; i++) {
			considering[applicationList[i][1]["jobseeker_id"]] = {app_id: applicationList[i][0], date: "", time: "", details: ""}
			initialise_showing[applicationList[i][0]]=false
		}

		console.log(initialise_showing)
		setShowing(initialise_showing)
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

					<Row style={{display:'flex', alignItems:'center'}}>
						<Col xs={8}>
							<Card style={{margin: 30, width:"100%"}}>
								<Card.Body>
									<Grid>
										<Row>
											<Col xs={8}>
												<Card.Title><Link to={"/viewapplication/"+jobID+'/'+app[0]}>{app[1].first_name} {app[1].last_name}</Link></Card.Title>
												<Card.Text style={{fontStyle: 'italic'}}>Meets {app[1].qualities_met} of the qualifications</Card.Text>
											</Col>
											{!sendTop && (<Col xs={4}>
												<div style={{display:'flex', justifyContent:'center', flexWrap: 'wrap'}}>
													<Button disabled = {status === "open"} 
													variant="contained" 
													style={{width:'80%', marginBottom:5, borderRadius:15, backgroundColor:'#348360', color:'white'}}
													onClick={() => {handleShow(app[0])}}> 
															Interview
													</Button><br/>
													<Button variant="contained"  
													style={{width:'80%', marginBottom:5, borderRadius:15, backgroundColor:'#348360'}}>
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
													onClick={() => {dismiss(app, index)}}>
														Dismiss
													</Button>
												</div>
											</Col>)}
										</Row>
										{sendTop && (<Row>
											<Form inline>
												<Col >
													<Form.Row>
													<Form.Group style={{marginRight:100}} controlId={"interview_date_" + app[0]}>
														<Form.Label style={{marginRight:10}}>Interview Date: </Form.Label>
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
													</Form.Row>
												</Col>
												<Col >
													<Form.Row>
													<Form.Group style={{marginRight:90}} controlId={"interview_time_" + app[0]}>
														<Form.Label style={{marginRight:10}}>Interview Time: </Form.Label>
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
													</Form.Row>
												</Col>
												<Col>
													<Form.Row>
													<Form.Group>
														<TextField
															name = "Details"
															variant = "outlined"
															required
															value = {inviteList[app[1].jobseeker_id]["details"]}
															InputProps={{
																style: {width: 400, marginLeft: 8,},
															}}
															placeholder = "Details of Interview"
															multiline
															rows={5}
															onChange = { (event) => handleDetails(event.target.value, app[1].jobseeker_id, app)}
															/>
													</Form.Group>
													</Form.Row>
												</Col>
											</Form>	
										</Row>)}
									</Grid>
								</Card.Body>
							</Card>
						</Col>
						<Col xs={4} style = {{display:'flex', justifyContent:'center'}}>
							{!sendTop && (
								<div>
									<IconButton disabled = {index === 0 || status === "open"} color="secondary" onClick = {(event) => moveAppUp(index, event)}>
										<KeyboardArrowUpIcon/>
									</IconButton>
									<IconButton disabled = {index === selection - 1 || index === applications.length - 1 || status === "open"} color="secondary" onClick = {(event) => moveAppDown(index, event)}>
										<KeyboardArrowDownIcon/>
									</IconButton>
								</div>
							)}
						</Col>
						<Modal show={showing[app[0]]} onHide={()=>handleClose(app[0])}>						
							<Modal.Header>
								<Modal.Title>Interview Invite</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Row >
									<Form inline style={{margin:5}}>
											<Form.Group style={{marginLeft:8,marginBottom:10}}>
												<Form.Label style={{marginRight:10}}>Interview Date: </Form.Label>
												<TextField 
													className={
														!datevalidator(app[1].jobseeker_id)
															? "form-control is-invalid"
															: "form-control"
													}
													required
													id={"single_interview_date_" + app[0]}
													type="date"
													min={today}
													value={inviteList[app[1].jobseeker_id]["date"]}
													onChange={ (event) => handleDate(event.target.value, app[1].jobseeker_id, app)}/>
													<Form.Control.Feedback type="invalid">
														Please enter a date in the future
													</Form.Control.Feedback>
											</Form.Group>
											<Form.Group style={{marginLeft:8}} controlId={"single_interview_time_" + app[0]}>
												<Form.Label style={{marginRight:10}}>Interview Time: </Form.Label>
												<TextField
													className={
														!timevalidator(app[1].jobseeker_id)
															? "form-control is-invalid"
															: "form-control"
													}
													required
													id={"single_interview_time_" + app[0]}
													type="time"
													value={inviteList[app[1].jobseeker_id]["time"]}
													onChange={ (event) => handleTime(event.target.value, app[1].jobseeker_id, app)}/>
													<Form.Control.Feedback type="invalid">
														Please enter a time
													</Form.Control.Feedback>
											</Form.Group>
											<Form.Group>
												<TextField
													name = "Details"
													variant = "outlined"
													required
													value = {inviteList[app[1].jobseeker_id]["details"]}
													InputProps={{
														style: {width: 400, marginLeft: 8,},
													}}
													placeholder = "Details of Interview"
													multiline
													rows={5}
													onChange = { (event) => handleDetails(event.target.value, app[1].jobseeker_id, app)}
													/>
											</Form.Group>
											
									</Form>	
								</Row>
							</Modal.Body>
							<Modal.Footer style={{marginTop:20}}>
								<Button variant="contained" color="default" onClick={()=>handleClose(app[0])}>Cancel</Button>
								<Button variant="contained" 
									disabled={disable}
									style={{marginLeft:10}}
									color="secondary"
									id={"interview_modal_" + app[0]} 
									onClick={(event)=>postInterview(event, app)}>Send</Button>
							</Modal.Footer>
						</Modal>
					</Row>
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
				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					open={open}
					autoHideDuration={5000}
					onClose={() => handleCloseSnackbar()}
					message={message}
					action={
						<IconButton size="small" aria-label="close" color="inherit" onClick={() => handleCloseSnackbar()}>
							<CloseIcon fontSize="small" />
						</IconButton>
					}
				/>
				<Row noGutters fluid><TitleBar name={window.localStorage.getItem("name")}/></Row>
				<Row noGutters style={{height:'100vh',paddingTop: 60}}>
					<Col sm="2">
					<SideMenu random={[
							{'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': false},
							{'text': detail[1].title,'href': '#','active': false,
							'nested':[
								{'text':'Applications','href': `/applications/${jobID}`,'active': true},
								{'text':'Interviews','href': `/interviews/${jobID}`,'active': false},
								{'text':'Offers','href': `/offers/${jobID}`,'active': false},
								{'text': 'Statistics','href': `/jobstatistics/${jobID}`,'active': false},
							]},
							{'text':'FAQ','href':'/recruiterFAQ','active': false}
						]}/>
					</Col>

					<Col sm="10">
					{/* <Col sm="9"> */}
						<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
							{detail[1].title}
						</Typography>
						<Typography variant="h6"  style={{color: 'black', textAlign: "center",margin:20 }}>
							{detail[1].company} | 
							{detail[1].status==="open"? (' Closing date: '+detail[1].closing_date) : ' This job has closed'}
						</Typography>
						<Row>
							<Col xs={8}>
								<Form inline>
									<Form.Group controlId="selection" style ={{ marginLeft:100}}>
										<Form.Label>Select top </Form.Label>
										<Form.Control
											required
											type = "number"
											min = {1}
											style={{width:80,margin:10}}
											max = {applications.length}
											placeholder={applications.length}
											disabled = {detail[1].status === "open"}
											//if user backspaces so box is empty, it should show all apps again
											onChange = { (event) => setSelection(event.target.value===''? applications.length: Math.min(event.target.value, applications.length))}/>
									</Form.Group>
									  applicants
								</Form>
							</Col>
							<Col xs={4}>
								<Button disabled = {detail[1].status === "open"}
								variant="contained" 
								style={{borderRadius: 30, backgroundColor:"#1C5253", color:'white'}}
								onClick={() =>{
									if (sendTop){
										postInterviews()
									}else{
										setSendTop(true)
									}
								}}> {sendTop ? ('Submit') : ('Send Interviews to Top '+ selection)}</Button>
								<Button disabled = {detail[1].status === "open"}
								style={{borderRadius:30,margin:10,visibility: sendTop? 'visible':'hidden'}}
								variant="contained" 
								onClick={()=>setSendTop(false)}>Cancel</Button>
							</Col>
						</Row>
						<Row style={{display: 'flex', justifyContent: 'center'}}>
							<Col xs={10}>
								{renderApplications(detail[1].status)}
							</Col>
						</Row>
					</Col>
				</Row>
			</Grid>
		))
	);
}