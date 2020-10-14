import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Grid,Button} from "@material-ui/core";
import {Form,Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const applicationUrl="http://localhost:5000/jobapplications"
export const advertisementUrl="http://localhost:5000/advertisement"

export default function JobApply() {
    const history = useHistory();
	const jobseeker_id = sessionStorage.getItem("uid");
	const href = `${window.location.href}`.split("/")
    const jobID = href[href.length - 1]
	//Used for form validation
	const [validated, setValidated] = useState(false);
	//form data
	const [first_name,setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
	const [rights, setRights] = useState('');
	//will be comma seperated strings - split on the commas to get an array
	const [required_docs, setRequiredDocs] = useState('');
	const [qualification_list, setQualificationList] = useState([]);
    const [matching_list, setMatchingList] = useState([]);
    const [job, setJob] = useState([]);

	useEffect(() => {
        auth();
		getJob();
	}, []);

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
    
    const handleChangeQualification = (index) => {
		const matching = [...matching_list]
		matching[index] = !matching[index]
		setMatchingList(matching)
	}

	const handleDocumentInput = (index, event, qualification_array) => {
		setQualificationList(qualification_array)
	}

	//TODO - ADD real JOBSEEKER ID TO JOB POST
	const applyJob = async (final_qualifications) => {
        const url = `${applicationUrl}`
        const data={
			first_name: first_name,
            last_name: last_name,
            phone_number: phone_number,
			rights: rights,
			qualifications: final_qualifications,
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
                if (matching_list[i]) {
                    final_qualifications.push(qualification_list[i]);
                }
            }
			applyJob(final_qualifications);
		}
	}

	return job.map((detail) => (
		<Grid>
			<Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100%',paddingTop: 40}}>
				<Col sm={2}>
					<SideMenu random={[
						{'text':'Job Seeker Dashboard','href': '/jobseekerdashboard', 'active': true},
						{'text':'Your Applications','href': '#', 'active': false},         
						{'text':'FAQ','href':'#','active': false}]}/>
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
							<Form.Label column sm={10}>First Name</Form.Label>
							<Col sm={10}>
								<Form.Control 
									required
									placeholder = "First Name"
									onChange = { (event) => setFirstName(event.target.value)} />
							</Col>
						</Form.Group>
						<Form.Group controlId="last_name">
							<Form.Label column sm={10}>Last Name</Form.Label>
							<Col sm={10}>
								<Form.Control
								required
								placeholder = "Last Name"
								onChange = { (event) => setLastName(event.target.value)}/>
							</Col>
						</Form.Group>

						<Form.Group controlId="phone_number">
							<Form.Label column sm={10}>Phone Number</Form.Label>
							<Col sm={10}>
								<Form.Control 
								required
								type = "number"
								placeholder = "Phone Number"
								onChange = { (event) => setPhoneNumber(event.target.value)}/>
							</Col>
						</Form.Group>

						<Form.Group controlId="rights">
						<Form.Label column sm={10}>Do you have the rights to work in {detail[1].location}?</Form.Label>
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
							<Form.Label column sm={10}>
								Please indicate the skills/experience you have for the following: {job[0][1].req_qualifications.split(",")}
							</Form.Label>
							<Col sm={10}>
							{detail[1].req_qualifications.split(",").map((qualification, index) => (
								<Form.Check
                                    type = "checkbox"
                                    id = {qualification}
                                    label = {qualification}
                                    onClick = { (event) => handleChangeQualification(index)}/>
                            ))}
							</Col>					
						</Form.Group>

						<Form.Group controlId="required_docs">
						<Form.Label column sm={10}>Please upload the following documents as a pdf.</Form.Label>
							<Col sm={10}>
								<ul>
									{detail[1].required_docs.split(",").map((document, index) => (
										<li>
											<Form.File
											required
											id = {document}
											label = {document}
											onClick = { (event) => handleDocumentInput(index, event, job[0][1].req_qualifications.split(","))}/>
										</li>
									))}
								</ul>
							</Col>
						</Form.Group>

						<Button variant="contained" color="secondary" type="submit" onSubmit={handleSubmit} style={{margin: 20}}>
							Submit Application
						</Button>
					</Form>
				</Col>
			</Row>
		</Grid>
	))
}