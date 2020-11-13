import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {IconButton,Grid,Button,TextField} from "@material-ui/core";
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import {Form,Container,InputGroup,Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const editJobUrl="http://localhost:5000/editjob"
export const advertisementUrl="http://localhost:5000/advertisement"

export default function EditJob({match}) {
	const history = useHistory();
	const today = new Date();
	const jobID = match.params.jobID;
	const [recruiterID, setRecruiterID] = useState('');
	const [datePosted, setDatePosted] = useState('');

	//Used for form validation
	const [validated, setValidated] = useState(false);
	//form data
	const [title,setTitle] = useState('');
	const [company,setCompany] = useState('');
	const [description,setDescription] = useState('');
	const [location,setLocation] = useState('');
	const [jobType,setJobType] = useState('');
	const [experienceLevel,setExperienceLevel] = useState('');
	const [salary,setSalary] = useState(0);
	const [closingDate,setClosingDate] = useState('');
	//will be comma seperated strings - split on the commas to get an array
	const [requiredDocs,setRequiredDocs] = useState([]);
	const [qualifications,setQualifications] = useState([]);
	//NOTE: if zero additional questions/responsibilities are added, the field will not exist
	//in the database record - must check when displaying job adverts that the field exists!!!
	const [additionalQuestions, setAdditionalQuestions] = useState([]);
	const [responsibilities, setResponsibilities] = useState([]);

	useEffect(() => {
		auth();
		getJobInfo();
	}, []);

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				// const recruiterID = sessionStorage.getItem("uid")			
				if (!response.success || response.userInfo["type"] != "recruiter") {
					history.push("/unauthorised");
				}
				setRecruiterID(response.userID);
			})
	}

	async function getJobInfo() {
		await axios.get(advertisementUrl, {params: {job_id: jobID}})
			.then(res => {
				console.log(res.data.job[0][1])
				const job_data = res.data.job[0][1]
				setTitle(job_data["title"]);
				setCompany(job_data["company"]);
				setDescription(job_data["description"]);
				setLocation(job_data["location"]);
				setJobType(job_data["job_type"]);
				setExperienceLevel(job_data["experience_level"]);
				setSalary(job_data["salary_pa"]);
				setClosingDate(job_data["closing_date"]);
				setRequiredDocs(job_data["required_docs"] || []);
				setQualifications(job_data["req_qualifications"] || []);
				setAdditionalQuestions(job_data["additional_questions"] || []);
				setResponsibilities(job_data["responsibilities"] || []);
				setDatePosted(job_data["date_posted"]);
			})
	}

	const handleAddDoc = () => {
		setRequiredDocs([...requiredDocs, ''])
	}
	const handleRemoveDoc = (index) => {
		const ds  = [...requiredDocs]
		//remove document
		ds.splice(index, 1)
		setRequiredDocs(ds)
	}
	const handleChangeDoc = (index, event) => {
		const ds = [...requiredDocs]
		ds[index]=event.target.value
		setRequiredDocs(ds)
	}

	const handleAddQuestion = () => {
		setAdditionalQuestions([...additionalQuestions, ''])
	}
	const handleRemoveQuestion = (index) => {
		const qs  = [...additionalQuestions]
		//remove question
		qs.splice(index, 1)
		setAdditionalQuestions(qs)
	}
	const handleChangeQuestion = (index, event) => {
		const qs = [...additionalQuestions]
		qs[index]=event.target.value
		setAdditionalQuestions(qs)
	}

	const handleAddQuality = () => {
		setQualifications([...qualifications, ''])
	}
	const handleRemoveQuality = (index) => {
		const qs  = [...qualifications]
		//remove qualification
		qs.splice(index, 1)
		setQualifications(qs)
	}
	const handleChangeQuality = (index, event) => {
		const qs  = [...qualifications]
		qs[index]=event.target.value
		setQualifications(qs)
	}

	const handleAddResponsibility = () => {
		setResponsibilities([...responsibilities, ''])
	}
	const handleRemoveResponsibility = (index) => {
		const rs  = [...responsibilities]
		//remove Responsibility
		rs.splice(index, 1)
		setResponsibilities(rs)
	}
	const handleChangeResponsibility = (index, event) => {
		const rs  = [...responsibilities]
		rs[index]=event.target.value
		setResponsibilities(rs)
	}

	//TODO - ADD real RECRUITER ID TO JOB POST
	const postJobUpdate = async () => {
		const data={
			title:title,
			location:location,
			description: description,
			company:company,
			closing_date:closingDate,
			recruiter_id: recruiterID,
			job_type: jobType,
			salary_pa:salary,
			experience_level:experienceLevel,
			qualifications: qualifications,
			required_docs: requiredDocs,
			status: today < Date.parse(closingDate)? 'open':'closed',
			additional_questions: additionalQuestions,
			responsibilities: responsibilities,
			date_posted: datePosted,
			jobid: jobID
		}
		// console.log(data)
		await axios.post(editJobUrl, data)
			.then(res => {
				console.log("response: ", res)
				alert("Changes successfully saved")
				history.push("/recruiterdashboard")
			})
			.catch((error) => {
				console.log("error: ", error.response)
				alert("An error occured, please try again")
			})	
	};
	
	
	const handleSubmit= async (event) =>{	
		event.preventDefault();
		const form = event.currentTarget;
		if (form.checkValidity() === false) {	
			event.stopPropagation();
			setValidated(true);
		}else{
			setValidated(true);
			//good to go
			postJobUpdate();
		}
	}

	return (
		<Grid>
			<Row noGutters fluid><TitleBar name={window.localStorage.getItem("name")}/></Row>
			<Row noGutters style={{height:'100%',paddingTop: 60}}>
				<Col sm="2">
					<SideMenu random={[
						{'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': true},
						{'text':'FAQ','href':'/recruiterFAQ','active': false}]}/>
				</Col>

				<Col sm="10" >
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						Edit Job
					</Typography>
					

					<Form noValidate validated={validated} onSubmit={handleSubmit} style={{marginLeft:'15%'}}>          
					
					<Form.Group controlId="closingDate">
							<Form.Label column sm={8}>
							Application Closing Date </Form.Label>
							<Col sm={10}>
							<TextField
								id="closingDate"
								type="date"
								min={today}
								value={closingDate}
								onChange={ (event) => 
									setClosingDate(event.target.value)	
								}
								/>
							<p style={{color: 'grey'}}>If you wish to close this job, select a date in the past.</p>
							</Col>
							
						</Form.Group>
						
						
						<Form.Group controlId="title">
							<Form.Label column sm={2}>Title</Form.Label>
							<Col sm={10}>
								<Form.Control 
									required
									placeholder="Title"
									defaultValue={title}
									onChange={ (event) => setTitle(event.target.value)} />
							</Col>
						</Form.Group>
						<Form.Group controlId="company">
							<Form.Label column sm={2}>Company</Form.Label>
							<Col sm={10}>
								<Form.Control
								required
								defaultValue={company}
								placeholder="Company"
								onChange={ (event) => setCompany(event.target.value)}/>
							</Col>
						</Form.Group>

						<Form.Group controlId="location">
							<Form.Label column sm={2}>Location</Form.Label>
							<Col sm={10}>
								<Form.Control 
								required
								defaultValue={location}
								placeholder="Location"
								onChange={ (event) => setLocation(event.target.value)}/>
							</Col>
						</Form.Group>

						<Form.Group controlId="description">
							<Form.Label column sm={2}>Description</Form.Label>
							<Col sm={10}>
								<Form.Control as="textarea" rows="3" 
								required
								defaultValue={description}
								onChange={ (event) => setDescription(event.target.value)}/>
							</Col>
						</Form.Group>

						<Form.Group controlId="responsibilities">
							<Form.Label column sm={2}>
							Key Responsibilities
							<IconButton onClick={() => handleAddResponsibility()}>
								<AddIcon />
							</IconButton>
							</Form.Label>
							
							<Col sm={10}>
							{responsibilities.map((r, index) => (
								<ul key={index}>
									<li><TextField 
									name="Responsibility"
									variant="outlined"
									size="small"
									placeholder="Responsibility"
									value={r}
									onChange={event => handleChangeResponsibility(index, event)}
									/>
									<IconButton onClick={() => handleRemoveResponsibility(index)}>
										<RemoveIcon />
									</IconButton></li>
								</ul>
							))}
							</Col>					
						</Form.Group>

						<Form.Group controlId="jobType">
						<Form.Label column sm={2}>Job Type</Form.Label>
							<Col sm={10}>
								<Form.Control as="select" 
								required
								value={jobType}
								onChange={e=>setJobType(e.target.value)} 
								>
									<option value="">--Select-- </option>
									<option>Part-time</option>
									<option>Full-time</option>
									<option>Casual/Vacation</option>
									<option>Temp/Contract</option>								
								</Form.Control>
							</Col>	
						</Form.Group>

						<Form.Group controlId="experienceLevel">
						<Form.Label column sm={2}>Experience Level</Form.Label>
							<Col sm={10}>
								<Form.Control as="select" 
								required
								value={experienceLevel}
								onChange={e=>setExperienceLevel(e.target.value)} 
								>
									<option value="">--Select-- </option>
									<option>Internship</option>
									<option>Entry level</option>
									<option>Associate</option>
									<option>Mid-Senior level</option>	
									<option>Director</option>	
									<option>Executive</option>								
								</Form.Control>
							</Col>	
						</Form.Group>

						<Form.Group controlId="salary">
							<Form.Label column sm={2}>
							Salary
							</Form.Label>
							
							<Col sm={10}>
								<InputGroup>
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control 
									placeholder=""
									required
									value={salary}
									type="number"
									onChange={ (event) => setSalary(event.target.value)}/>
									<Form.Control.Feedback type="invalid">
									Please enter a number
									</Form.Control.Feedback>
								</InputGroup>
							</Col>
						</Form.Group>

						
						
							
						<Form.Group controlId="qualifications">
							<Form.Label column sm={2}>
							Desired Qualifications
							<IconButton onClick={() => handleAddQuality()}>
								<AddIcon />
							</IconButton>
							</Form.Label>
							
							<Col sm={10}>
							{qualifications.map((q, index) => (
								<ul key={index}>
									<li><TextField 
									name="Quality"
									variant="outlined"
									size="small"
									placeholder="Quality"
									value={q}
									onChange={event => handleChangeQuality(index, event)}
									/>
									<IconButton onClick={() => handleRemoveQuality(index)}>
										<RemoveIcon />
									</IconButton></li>
								</ul>
							))}
							</Col>					
						</Form.Group>

						<Form.Group controlId="requiredDocs">
							<Form.Label column sm={2}>
							Required Documents
							<IconButton onClick={() => handleAddDoc()}>
								<AddIcon />
							</IconButton>
							</Form.Label>
							
							<Col sm={10}>
							{requiredDocs.map((doc, index) => (
								<ul key={index}>
									<li><TextField 
									name="Document"
									variant="outlined"
									size="small"
									placeholder="Document"
									value={doc}
									onChange={event => handleChangeDoc(index, event)}
									/>
									<IconButton onClick={() => handleRemoveDoc(index)}>
										<RemoveIcon />
									</IconButton></li>
								</ul>
							))}
							</Col>					
						</Form.Group>

						<Form.Group controlId="additionalQuestions">
							<Form.Label column sm={2}>
							Additional Questions
							<IconButton onClick={() => handleAddQuestion()}>
								<AddIcon />
							</IconButton>
							</Form.Label>
							
							<Col sm={10}>
							{additionalQuestions.map((question, index) => (
								<div key={index}>
									<TextField 
									name="Question"
									variant="outlined"
									size="small"
									placeholder="Additional Question"
									value={question}
									onChange={event => handleChangeQuestion(index, event)}
									/>
									<IconButton onClick={() => handleRemoveQuestion(index)}>
										<RemoveIcon />
									</IconButton>
								</div>
							))}
							</Col>					
						</Form.Group>

						<Button variant="contained" color="secondary" type="submit" onSubmit={handleSubmit} style={{margin: 20}}>
							Submit changes
						</Button> 
					</Form>  		
				</Col>
			</Row>
		</Grid>
	);
}