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
	//for date picker (closing date)
	//More info: https://material-ui.com/components/pickers/
    const [selectedDate, setSelectedDate] = useState(new Date('2014-08-18T21:11:54'));
	const handleDateChange = (date) => {
		setSelectedDate(date);
	};


    //error msg or successful job creation
    const [response,setResponse]=useState('')
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

	const [fields,setFields] = useState([]);
	const minDate = new Date(Date.now());

	function handleChange(i, event) {
		const values = [...fields];
		values[i] = event.target.value;
		setFields(values);
	  }
	
	  function addField() {
		const values = [...fields];
		values.push("");
		setFields(values);
	  }
	
	  function removeField(i) {
		const values = [...fields];
		values.splice(i, 1);
		setFields(values);
	  }

	//TODO - ADD real RECRUITER ID TO JOB POST
	// verify that closing date is valid! else do a pop telling them to reenter date
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
	
    const handleSubmit= async (event) =>{
        event.preventDefault();
		postJob();
        
    };

	return (
		<Grid>
			<Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 40}}>
				<Col sm="2">
					<SideMenu random={[
						{'text':'Recruiter Dashboard','href': '#','active': true},
						{'text':'FAQ','href':'#','active': false}]}/>
				</Col>

				<Col sm="10" >
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						Create New Job
					</Typography>
                    <Form onSubmit={handleSubmit} style={{marginLeft:'15%'}}>
                       
                        <Form.Group controlId="title">
							<Form.Label column sm={2}>
							Title
							</Form.Label>
							<Col sm={10}>
								<Form.Control placeholder="Title"
									onChange={ (event) => setTitle(event.target.value)} />
							</Col>
						</Form.Group>
						<Form.Group controlId="company">
							<Form.Label column sm={2}>
							Company
							</Form.Label>
							<Col sm={10}>
								<Form.Control placeholder="Company"
								onChange={ (event) => setCompany(event.target.value)}/>
							</Col>
						</Form.Group>

						<Form.Group controlId="location">
							<Form.Label column sm={2}>
							Location
							</Form.Label>
							<Col sm={10}>
								<Form.Control placeholder="Location"
								onChange={ (event) => setLocation(event.target.value)}/>
							</Col>
						</Form.Group>

						<Form.Group controlId="description">
							<Form.Label column sm={2}>
							Description</Form.Label>
							<Col sm={10}>
								<Form.Control as="textarea" rows="3" 
								onChange={ (event) => setDescription(event.target.value)}/>
							</Col>
						</Form.Group>

						<Form.Group controlId="jobType">
						<Form.Label column sm={2}>
							Job type</Form.Label>
							<Col sm={10}>
								<Form.Control as="select" 
								onChange={e=>setJobType(e.target.value)} 
								defaultValue="Choose...">
									<option>Choose...</option>
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
								onChange={e=>setExperienceLevel(e.target.value)} 
								defaultValue="Choose...">
									<option>Choose...</option>
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
									<Form.Control placeholder=""
									onChange={ (event) => setSalary(event.target.value)}/>
									<Form.Text className="text-muted">
									Please enter salary in units of K/$1000
									</Form.Text>
								</InputGroup>
							</Col>
						</Form.Group>

						
						<Form.Group controlId="closingDate">
							<Form.Label column sm={2}>
							Closing Date</Form.Label>
							<Col sm={10}>
								<TextField
									id="closingDate"
									type="date"
									onChange={ (event) => setClosingDate(event.target.value)}
								/>
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
						

						<fieldset>
						<Form.Group controlId="fields">
							<Form.Label as="legend" column sm={2}>
							Alternate way of adding skills (not working yet)
							</Form.Label>
							<Button style={{marginLeft: 30}} onClick={ addField
							}>
							+ Add New Skill
							</Button>
							<Col sm={10}>
							
								{ fields.map((field, idx) => {
									return (
										<Col>
										<Form.Control placeholder="skill"
										onChange={e => handleChange(idx, e)} />
										<button type="button" onClick={() => removeField(idx)}>
										X
										</button>
										</Col>
								)})}
							</Col>
						</Form.Group>
						</fieldset>


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