import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link, Input,InputAdornment, Grid,Button,FormControl,InputLabel,TextField} from "@material-ui/core";
import {Form,Container,InputGroup,Col,Row,Collapse} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";

export const jobUrl="http://localhost:5000/jobadverts"

export default function NewJobForm() {
	const history = useHistory();
	
    //error msg or successful job creation
	const [response,setResponse]=useState('')
	//Used for form validation
	const [validated, setValidated] = useState(false);
	//form data
	const [title,setTitle] = useState('');
	const [company,setCompany] = useState('');
	const [description,setDescription] = useState('');
	const [minYearsExp,setMinYearsExp] = useState('');
    const [location,setLocation] = useState('');
    const [jobType,setJobType] = useState('');
    const [experienceLevel,setExperienceLevel] = useState('');
    //salary units in units k/$1000
	const [salary,setSalary] = useState(100);
	const [closingDate,setClosingDate] = useState('');
	//will be comma seperated strings - split on the commas to get an array
	const [requiredDocs,setRequiredDocs] = useState('');
	const [skills,setSkills] = useState('');

	
	//TODO - ADD real RECRUITER ID TO JOB POST
	//verify that closing date is valid! else do a pop up telling them to reenter date
	const postJob = async () => {
        const url = jobUrl
        const data={
			title:title,
			location:location,
			company:company,
			closing_date:closingDate,
			recruiter_id:'1234',
			job_type: jobType,
			salary_pa:salary,
			experience_level:experienceLevel,
			skills:skills,
			required_docs: requiredDocs,
			status: 'open',
		}
		await axios.post(url, data)
			.then(res => {
				setResponse(res.data)
				console.log("response: ", res)
				alert("Job successfully created")
				history.push("/recruiterdashboard")
			})
			.catch((error) => {
				console.log("error: ", error.response)
				alert("An error occured, please try again")
			})
		
	};
	const today = new Date()
	const datevalidator =()=>{
		return closingDate !== "" && today < Date.parse(closingDate)
	}
    const handleSubmit= async (event) =>{
		
		const form = event.currentTarget;
		const correct_date=datevalidator()
		
		if (form.checkValidity() === false && correct_date==false) {
			event.preventDefault();
			event.stopPropagation();
			setValidated(true);
		}else{

			setValidated(true);
			//good to go
			postJob();
		}
	}

	return (
		<Grid>
			<Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 40}}>
				<Col sm="2">
					<SideMenu random={[
						{'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': true},
						{'text':'FAQ','href':'#','active': false}]}/>
				</Col>

				<Col sm="10" >
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						Create New Job
					</Typography>
                    <Form noValidate validated={validated} onSubmit={handleSubmit} style={{marginLeft:'15%'}}>
                       
                        <Form.Group controlId="title">
							<Form.Label column sm={2}>
							Title
							</Form.Label>
							<Col sm={10}>
								<Form.Control 
									required
									placeholder="Title"
									onChange={ (event) => setTitle(event.target.value)} />
							</Col>
						</Form.Group>
						<Form.Group controlId="company">
							<Form.Label column sm={2}>
							Company
							</Form.Label>
							<Col sm={10}>
								<Form.Control
								required
								placeholder="Company"
								onChange={ (event) => setCompany(event.target.value)}/>
							</Col>
						</Form.Group>

						<Form.Group controlId="location">
							<Form.Label column sm={2}>
							Location
							</Form.Label>
							<Col sm={10}>
								<Form.Control 
								required
								placeholder="Location"
								onChange={ (event) => setLocation(event.target.value)}/>
							</Col>
						</Form.Group>

						<Form.Group controlId="description">
							<Form.Label column sm={2}>
							Description</Form.Label>
							<Col sm={10}>
								<Form.Control as="textarea" rows="3" 
								required
								onChange={ (event) => setDescription(event.target.value)}/>
							</Col>
						</Form.Group>

						<Form.Group controlId="jobType">
						<Form.Label column sm={2}>
							Job type</Form.Label>
							<Col sm={10}>
								<Form.Control as="select" 
								required
								onChange={e=>setJobType(e.target.value)} 
								defaultValue="Select">
									<option selected disabled>Select </option>
									<option>Part-time</option>
									<option>Full-time</option>
									<option>Casual/Vacation</option>
									<option>Temp/Contract</option>								
								</Form.Control>
							</Col>	
						</Form.Group>

						<Form.Group controlId="experienceLevel">
						<Form.Label column sm={2}>
							Experience Level</Form.Label>
							<Col sm={10}>
								<Form.Control as="select" 
								required
								onChange={e=>setExperienceLevel(e.target.value)} 
								defaultValue="Select">
									<option selected disabled>Select </option>
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
							Salary (p.a)
							</Form.Label>
							
							<Col sm={10}>
								<InputGroup>
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control 
									placeholder=""
									required
									type="number"
									onChange={ (event) => setSalary(event.target.value)}/>
									<Form.Text className="text-muted">
									Please enter salary in units of K/$1000
									</Form.Text>
									<Form.Control.Feedback type="invalid">
										Please enter a valid number
									</Form.Control.Feedback>
								</InputGroup>
							</Col>
						</Form.Group>

						
						<Form.Group controlId="closingDate">
							<Form.Label column sm={2}>
							Closing Date</Form.Label>
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
									onChange={ (event) => 
											setClosingDate(event.target.value)	
									}
								/>
								<Form.Control.Feedback type="invalid">
									Please enter a date in the future
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
							
						<Form.Group controlId="skills">
							<Form.Label column sm={2}>
							Desired Skills
							</Form.Label>
							<Col sm={10}>
								<Form.Control placeholder="e.g. excel, python"
								onChange={ (event) => setSkills(event.target.value)}/>
							</Col>					
						</Form.Group>

						<Form.Group controlId="requiredDocs">
							<Form.Label column sm={2}>
							Required Documents
							</Form.Label>
							<Col sm={10}>
								<Form.Control placeholder="e.g. cover letter, resume, passport"
								onChange={ (event) => setRequiredDocs(event.target.value)}/>
							</Col>					
						</Form.Group>

					<Button variant="contained" color="primary" type="submit" onSubmit={handleSubmit} style={{margin: 20}}>
					Create New Job
					</Button>    

					</Form>  		
				</Col>
			</Row>
		</Grid>
	);
}