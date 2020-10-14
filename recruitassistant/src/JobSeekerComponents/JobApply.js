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

export const applicationUrl="http://localhost:5000/jobapplications"

export default function JobApply() {
    const history = useHistory();
    const jobseeker_id = sessionStorage.getItem("uid");
	//Used for form validation
	const [validated, setValidated] = useState(false);
	//form data
	const [first_name,setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
	const [rights, setRights] = useState('');
	//will be comma seperated strings - split on the commas to get an array
	const [required_docs, setRequiredDocs] = useState('');
    const [qualifications, setQualifications] = useState('');
    const [qualification_list, setQualificationList] = useState('');
    const [matching_list, setMatchingList] = useState('');
    const [job, setJob] = useState('');

	useEffect(() => {
        auth();
        getJob();
	}, [jobseeker_id]);

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				// const jobseekerID = sessionStorage.getItem("uid")			
				if (!response.success || response.userInfo["type"] != "jobseeker") {
					history.push("/unauthorised");
				}
			})
	}
    
    const getJob = async () => {
		const url = `${applicationUrl}${jobseeker_id}`
		console.log(url)
		await axios.get(url)
			.then(res => {
                setJob(res.data.job)
                setQualificationList(job.qualifications.split("[,]", 0))
                setMatchingList(new boolean[qualification_list.length])
                for (var i = 0; i < qualification_list.length; i++) {
                    matching_list[i] = false
                }
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

	//TODO - ADD real JOBSEEKER ID TO JOB POST
	const applyJob = async () => {
        const url = jobUrl
        const data={
			first_name: first_name,
            last_name: last_name,
            phone_number: phone_number,
			rights: rights,
			qualifications: qualifications,
			required_docs: required_docs,
            jobseeker_id: jobseeker_id
		}
		console.log(data)
		await axios.post(url, data)
			.then(res => {
				console.log("response: ", res)
				alert("Job application successfully created")
				history.push("/jobseekerdashboard")
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
            const final_qualifications = []
            for (var i = 0; i < qualification_list.length; i++) {
                if (matching_list[i] === true) {
                    final_qualifications.push(qualification_list[i])
                }
            }
            setQualifications(final_qualifications)
			applyJob();
		}
	}

	return (
		<Grid>
			<Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100%',paddingTop: 40}}>
				<Col sm="2">
					<SideMenu random={[
						{'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': true},
						{'text':'FAQ','href':'#','active': false}]}/>
				</Col>

				<Col sm="10" >
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						Apply For Job
					</Typography>
                    <Typography variant="h5" component="h2">
						{job.title}
					</Typography>
					<Typography color="textSecondary">
						{job.company} | {job.location}
					</Typography>

                    <Form noValidate validated={validated} onSubmit={handleSubmit} style={{marginLeft:'15%'}}>          
                        <Form.Group controlId="first_name">
							<Form.Label column sm={2}>First Name</Form.Label>
							<Col sm={10}>
								<Form.Control 
									required
									placeholder = "First Name"
									onChange = { (event) => setFirstName(event.target.value)} />
							</Col>
						</Form.Group>
						<Form.Group controlId="last_name">
							<Form.Label column sm={2}>Last Name</Form.Label>
							<Col sm={10}>
								<Form.Control
								required
								placeholder = "Last Name"
								onChange = { (event) => setLastName(event.target.value)}/>
							</Col>
						</Form.Group>

						<Form.Group controlId="phone_number">
							<Form.Label column sm={2}>Phone Number</Form.Label>
							<Col sm={10}>
								<Form.Control 
								required
								type = "number"
								placeholder = "Phone Number"
								onChange = { (event) => setPhoneNumber(event.target.value)}/>
							</Col>
						</Form.Group>

						<Form.Group controlId="rights">
						<Form.Label column sm={2}>Do you have the rights to work in {job.location}?</Form.Label>
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

						<Form.Group controlId="qualifications">
							<Form.Label column sm={2}>
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

						<Form.Group controlId="required_docs">
						<Form.Label column sm={2}>Please upload the following documents as a pdf</Form.Label>
                        <Col sm={10}>
							{job.required_docs.split("[,]", 0).map((document, index) => (
								<Form.File
                                    required
                                    id = {document}
                                    label = {document}
                                    onClick = { (event) => handleDocumentInput(index, event)}/>
                            ))}
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
						Apply
						</Button> 
					</Form>  		
				</Col>
			</Row>
		</Grid>
	);
}