import React, { useState,useEffect } from "react";
import {Grid,Button,TextField,Snackbar,IconButton} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close'
import {Form,Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import MuiPhoneNumber from "material-ui-phone-number";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";



export const uploadUrl="http://localhost:5000/upload"
export const applicationUrl="http://localhost:5000/jobapplications"
export const advertisementUrl="http://localhost:5000/advertisement"
export const userUrl="http://localhost:5000/user"
export default function JobApply() {
	const history = useHistory();
	const jobseeker_id = sessionStorage.getItem("uid");
	const href = `${window.location.href}`.split("/")
	const jobID = href[href.length - 1]
	//Used for form validation
	const [submitted, setSubmitted] = useState(false);
	const [validated, setValidated] = useState(false);
	const [applied, setApplied] = useState(false);
	const [open, setOpen] = useState(false)
	const [disable, setDisable] = useState(false)
	const [message, setMessage] = useState('')
	//form data
	const [firstName,setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phone_number, setPhoneNumber] = useState('');
	const [rights, setRights] = useState('');
	const [qualification_list, setQualificationList] = useState([]);
	const [answers, setAnswers] = useState([])
	//which required qualifications the user
	const [additional_questions, setAdditionalQuestions] = useState([]);
	const [required_docs, setRequiredDocs] = useState([]);
	const [matching_list, setMatchingList] = useState([]);
	const [job, setJob] = useState([]);
	const [additionalDocs, setAdditionalDocs] = useState([]);
	const [needQualities, setNeedQualities] = useState(false);
	const [needQuestions, setNeedQuestions] = useState(false);
	const [needDocs, setNeedDocs] = useState(false);

	useEffect(() => {
		auth();
		getName();
		getJob();
		checkJobApplied();	
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				// const jobseekerID = sessionStorage.getItem("uid")			
				if (!response.success || response.userInfo["type"] !== "jobseeker") {
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
			//initialise need for docs to be uploaded
			const req_docs= res.data.job[0][1].required_docs
			if (typeof req_docs === "undefined") {
				setRequiredDocs([])
				setNeedDocs(false)
			} else {
				setRequiredDocs(req_docs)
				setNeedDocs(true)
			}
			//initialise need for additional questions
			const questions= res.data.job[0][1].additional_questions
			if (typeof questions === "undefined") {
				setAdditionalQuestions([])
				setNeedQuestions(false)
			} else {
				setAdditionalQuestions(questions)
				setNeedQuestions(true)
			}
			//initialise qualifications list
			const req_quals= res.data.job[0][1].req_qualifications
			if (typeof req_quals === "undefined") {
				setQualificationList([])
				setNeedQualities(false)
			} else {
				setQualificationList(req_quals)
				setNeedQualities(true)
			}
			//initialise matching qualifications list to all false
			var initial_list=[]
			for (var i=0; i<req_quals.length; i++){
				initial_list.push(false)
			}
			setMatchingList(initial_list)
		})
		.catch((error) => {
			console.log("error: ", error.response)
		})
	};

	//get the job seeker who is applying fullname, to prefill application
	const getName = async()=>{
		await axios.get(userUrl, {
			params: {
				jobseeker_id: jobseeker_id
			},
		})
		.then(res => {
			console.log(res)
			setFirstName(res.data.user['first_name'])
			setLastName(res.data.user['last_name'])
		}).catch((error) => {
			console.log("error: ", error.response)
		})
	}

	const checkJobApplied = async () => {
		const url = `${applicationUrl}`
		console.log(url)
		await axios.get(url, {
				params: {
					job_id: jobID,
					jobseeker_id: sessionStorage.getItem("uid")
				},
			})
			.then(res => {
				setApplied(res.data.applied)
				console.log("response: ", res)
			})
			.catch((error) => {
				console.log("error: ", error.response)
			})
	};
	
	const handleChangeQualification = (index) => {
		const matching = [...matching_list]
		matching[index] = !matching[index]
		setMatchingList(matching)
	}

	const handleChangeAnswer = (index, answer) => {
		const answer_list = [...answers]
		answer_list[index] = answer
		setAnswers(answer_list)
	}

	const handleClose = () => {
		setOpen(false)
		if (message === "Applied successfully") {
			history.push("/jobseekerdashboard")
		}
	}

	const applyJob = async () => {
		const url = `${applicationUrl}`
		//get qualifications the user ticked
		const final_qualifications = []
		for (var i = 0; i < qualification_list.length; i++) {
			if (matching_list[i]) {
				final_qualifications.push(qualification_list[i]);
			}
		}
		const data={
			first_name: firstName,
			last_name: lastName,
			phone_number: phone_number,
			rights: rights,
			qualifications: final_qualifications,
			qualities_met: final_qualifications.length,
			answers: answers,
			jobseeker_id: jobseeker_id,
			job_id: jobID,
			submitted_docs: additionalDocs
		}
		console.log("data: ",data)
		await axios.post(url, data)
			.then(res => {
				//console.log("response: ", res)
				setMessage("Applied successfully")
				setOpen(true)
				setDisable(true)
			})
			.catch((error) => {
				console.log("error: ", error.response)
				setMessage("An error occurred, please try again")
				setOpen(true)
			})
	};

	const handleSubmit= async (event) =>{	
		event.preventDefault();
		setSubmitted(true)
		const form = event.currentTarget;
		if (form.checkValidity() === false || !phone_number ) {	
			event.stopPropagation();
			setValidated(true);
		} else {
            setValidated(true);
            applyJob();
		}
	}
	
	//document upload methods
	const handleChangeDoc = (index,document_name,event) => {	
		console.log(index)
		var file=event.target.files[0]
		if (file) {
			var filename=event.target.files[0].name
			var filetype= event.target.files[0].type
			console.log(filetype)
			if(filetype!=="application/pdf"){
				setMessage("Please upload a pdf")
				setOpen(true)
				return 0
			}
			const reader = new FileReader()
			reader.onload = (e) => handleFileLoad(filename,document_name,index,e);
			reader.readAsDataURL(file)
		} else {
			var docs = [...additionalDocs]
			docs[index] = undefined
			setAdditionalDocs(docs)
		}
	}
	
	const handleFileLoad= (filename,document_name,index,event)=>{
		var docs = [...additionalDocs]
		docs[index]={'req_document': document_name,'filename': filename, 'src': event.target.result}
		setAdditionalDocs(docs)
	}
	
								
	
	return job.map((detail) => (
		<Grid>
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				open={open}
				autoHideDuration={5000}
				onClose={() => handleClose()}
				message={message}
				action={
					<IconButton size="small" aria-label="close" color="inherit" onClick={() => handleClose()}>
						<CloseIcon fontSize="small" />
					</IconButton>
				}
			/>
		<Row noGutters fluid><TitleBar name={window.localStorage.getItem("name")}/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 60}}>
				<Col sm={2}>
					<SideMenu random={[
						{'text':'Job Seeker Dashboard','href': '/jobseekerdashboard', 'active': true},
						{'text':'Your Applications','href': '/yourapplications', 'active': false},         
						{'text':'FAQ','href':'/jobseekerFAQ','active': false}]}/>
				</Col >

				<Col sm="10" >
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						Apply For Job
					</Typography>
					<Typography component="div" style={{textAlign: "center",margin:20 }}>
						<Box fontSize="h5.fontSize">
							{detail[1].title}
						</Box>
						<Box fontSize="h6.fontSize">
							{detail[1].company} | {detail[1].location}
						 </Box>
					</Typography>

					<Form noValidate validated={validated} onSubmit={handleSubmit} style={{marginLeft:'15%'}}>          
						<Form.Group controlId="first_name">
							<Form.Label column sm={10}>*First Name</Form.Label>
							<Col sm={10}>
								<Form.Control 
									required
									value={firstName}
									placeholder = "First Name"
									onChange = { (event) => setFirstName(event.target.value)} />
							</Col>
						</Form.Group>

						<Form.Group controlId="last_name">
							<Form.Label column sm={10}>*Last Name</Form.Label>
							<Col sm={10}>
								<Form.Control
								required
								value={lastName}
								placeholder = "Last Name"
								onChange = { (event) => setLastName(event.target.value)}/>
							</Col>
						</Form.Group>

						<Form.Group controlId="phone_number">

							<Form.Label column sm={10}>*Phone Number</Form.Label>
							<Col sm={10}>
							<MuiPhoneNumber 
							error={phone_number? false: true}
							defaultCountry={'au'} onChange={setPhoneNumber}/>
							</Col>
						</Form.Group>

						<Form.Group controlId="rights">
						<Form.Label column sm={10}>*Do you have the rights to work in {detail[1].location}?</Form.Label>
							<Col sm={10}>
								<Form.Control as="select" 
								required
								onChange = {e => setRights(e.target.value)} 
								>
									<option value="">--Select-- </option>
									<option>Yes</option>
									<option>No</option>								
								</Form.Control>
							</Col>	
						</Form.Group>

						<div style={{visibility: needQualities? 'visible': 'hidden'}}>
							<Form.Group controlId="qualifications">
								<Form.Label column sm={10}>
									Please indicate the skills/experience you have for the following:
								</Form.Label>
								<Col sm={10}>
								{qualification_list.map((qualification, index) => (
									<Form.Check
										type = "checkbox"
										id = {qualification}
										label = {qualification}
										onClick = { (event) => handleChangeQualification(index)}/>
								))}
								</Col>					
							</Form.Group>
						</div>

						<div style={{visibility: needQuestions? 'visible': 'hidden'}}>
							<Form.Group controlId="additional_questions" >
							<Form.Label column sm={10}>Please answer the following questions:</Form.Label>
								<Col sm={10} lineHeight={2}>
									<ol>
										{additional_questions.map((question,index) => (
											<li>
												<p>*{question}</p>
												<TextField
													required
													id = {index}
													name = {question}
													style = {{width: 745, marginBottom: 20}}
													value = {answers[index]}
													variant="outlined"
													placeholder = "Answer"
													onChange = {(e)=>handleChangeAnswer(index,e.target.value)}/>
												{submitted && (answers[index] === '' || typeof answers[index] === "undefined")?(<div style={{color:"red"}}>Please answer the question</div>):(<div></div>)}
												<br></br>
											</li>
										))}
									</ol>
								</Col>
							</Form.Group>
						</div>

						<div style={{visibility: needDocs? 'visible': 'hidden'}}>
							<Form.Group controlId="required_docs" >
							<Form.Label column sm={10}>*Please upload the following documents as a pdf.</Form.Label>
								<Col sm={10}>
									<ul>
										{required_docs.map((document,index) => (
											<li>
												<Form.File
													required
													id = {index}
													name = {document}
													label = {document}
													accept = "application/pdf"
													onChange = {(e)=>handleChangeDoc(index,document,e)}/> 
											{submitted && (additionalDocs[index] === '' || typeof additionalDocs[index] === "undefined")?(<span style={{color:"red"}}>Please upload a pdf file</span>):(<div></div>)}
											</li>
										))}
									</ul>
								</Col>
							</Form.Group>
						</div>
						
						<Button disabled = {applied || detail[1].status === "closed" || disable} variant="contained" color="secondary" type="submit" onSubmit={handleSubmit} style={{margin: 20}}>
							Submit Application
						</Button>
					</Form>
				</Col>
			</Row>
		</Grid>
	))
										
}