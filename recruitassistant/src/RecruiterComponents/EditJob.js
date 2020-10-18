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
	//salary units in units k/$1000
	const [salary,setSalary] = useState(100);
	const [closingDate,setClosingDate] = useState('');
	//will be comma seperated strings - split on the commas to get an array
	const [requiredDocs,setRequiredDocs] = useState('');
	const [qualifications,setQualifications] = useState('');
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
				setRequiredDocs(job_data["required_docs"]);
				setQualifications(job_data["req_qualifications"]);
				setAdditionalQuestions(job_data["additional_questions"]);
				setResponsibilities(job_data["responsibilities"]);
				setDatePosted(job_data["date_posted"]);
			})
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
			status: 'open',
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
	
	const datevalidator =()=>{
		return closingDate !== "" && today < Date.parse(closingDate)
	}

	const handleSubmit= async (event) =>{	
		event.preventDefault();
		const form = event.currentTarget;
		const correct_date=datevalidator()
		//Closing dates will always be after today, hence status is always 'open' for a new job
		if (form.checkValidity() === false || correct_date==false) {	
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
			<Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100%',paddingTop: 60}}>
				<Col sm="2">
					<SideMenu random={[
						{'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': true},
						{'text':'FAQ','href':'#','active': false}]}/>
				</Col>

				<Col sm="10" >
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						Edit Job
					</Typography>

					<Form noValidate validated={validated} onSubmit={handleSubmit} style={{marginLeft:'15%'}}>          
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
							</Form.Label>
							<IconButton onClick={() => handleAddResponsibility()}>
								<AddIcon />
							</IconButton>
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
							Salary K/p.a
							</Form.Label>
							
							<Col sm={10}>
								<InputGroup>
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control 
									placeholder=""
									required
									defaultValue={salary}
									type="number"
									onChange={ (event) => setSalary(event.target.value)}/>
									<Form.Text className="text-muted">
									Please enter salary in units of K/$1000
									</Form.Text>
									<Form.Control.Feedback type="invalid">
									Please enter a number
									</Form.Control.Feedback>
								</InputGroup>
							</Col>
						</Form.Group>

						
						<Form.Group controlId="closingDate">
							<Form.Label column sm={2}>
							Application Closing Date</Form.Label>
							<Col sm={10}>
							<TextField 
								className={
									!datevalidator()
										? "form-control is-invalid"
										: "form-control"
								}
								id="closingDate"
								type="date"
								min={today}
								value={closingDate}
								onChange={ (event) => 
									setClosingDate(event.target.value)	
								}
								/>
								<Form.Control.Feedback type="invalid">
									Please enter a date in the future
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
							
						<Form.Group controlId="qualifications">
							<Form.Label column sm={2}>
							Desired Qualifications
							</Form.Label>
							<Col sm={10}>
								<Form.Control placeholder="e.g. excel, python"
								defaultValue={qualifications}
								onChange={ (event) => setQualifications(event.target.value)}/>
							</Col>					
						</Form.Group>

						<Form.Group controlId="requiredDocs">
							<Form.Label column sm={2}>
							Required Documents
							</Form.Label>
							<Col sm={10}>
								<Form.Control placeholder="e.g. cover letter, resume, passport"
								defaultValue={requiredDocs}
								onChange={ (event) => setRequiredDocs(event.target.value)}/>
							</Col>					
						</Form.Group>

						<Form.Group controlId="additionalQuestions">
							<Form.Label column sm={2}>
							Additional Questions
							</Form.Label>
							<IconButton onClick={() => handleAddQuestion()}>
								<AddIcon />
							</IconButton>
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