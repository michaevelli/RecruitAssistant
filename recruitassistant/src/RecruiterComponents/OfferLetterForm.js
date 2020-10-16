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

export const offerURL="http://localhost:5000/offer"

export default function OfferLetterForm() {
	const history = useHistory();
	const options = {year: 'numeric', month: 'long', day: 'numeric' };
    const t  = new Date();
    const today=t.toLocaleDateString("en-US", options);

    //todo-- prefill these variables
     //pull title,company, job seeker first and last name from the job application
    const title= "Job title here"
    const company ="company name"
    const jobseeker_name="Jim"
    const  default_text =`Date: ${today}\nDear ${jobseeker_name},\n\nyour text here`

    const default_location="florida"
    const default_jobtype="Part-time"
    const default_salary=10000

	//Used for form validation
    const [validated, setValidated] = useState(false);
    //form data that may be modified
    const [location,setLocation] = useState(default_location);
	const [description,setDescription] = useState(default_text);
    const [jobType, setJobType]=useState(default_jobtype) //default to type on the job advert
    //salary - up to recruitet to specify if per hour or p.a
	const [salary,setSalary] = useState(default_salary);
    
    const [startDate, setStartDate]=useState('');
    const [endDate, setEndDate]=useState('n/a');

    //hours per week
    const [hours, setHours]=useState('0 per week');
    const [days, setDays]=useState('Monday - Friday');
   
	//NOTE: if zero additional questions/responsibilities are added, the field will not exist
	//in the database record - must check when displaying job adverts that the field exists!!!
	const [additionalDocs, setAdditionalDocs] = useState([]);
	
	useEffect(() => {
		auth();
	});

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				// const recruiterID = sessionStorage.getItem("uid")			
				if (!response.success || response.userInfo["type"] != "recruiter") {
					history.push("/unauthorised");
				}
			})
	}

	const handleAddDoc = () => {
		setAdditionalDocs([...additionalDocs, ''])
	}
	const handleRemoveDoc = (index) => {
		const qs  = [...additionalDocs]
		//remove question
		qs.splice(index, 1)
		setAdditionalDocs(qs)
	}
	const handleChangeDoc = (index, event) => {
		const qs = [...additionalDocs]
		qs[index]=event.target.value
		setAdditionalDocs(qs)
	}

    //TODO - get jobseeker id from the application whose 'offer' button we clicked...
    //also get jobapplication id
	const postOffer = async () => {
        const url = offerURL
        const data={
			//title:title,
			//location:location,
			description: description,
			//company:company,
            date:today,
            recruiter_id: sessionStorage.getItem("uid"),
            jobapplication_id: null,
            jobseeker_id: null,
			job_type: jobType,
			salary_pa:salary,
			status: 'sent', //status of the offer can be sent (first time, or in respnse to counter offer), accepted,rejected
			additionalDocs: additionalDocs,
		}
		console.log(data)
		await axios.post(url, data)
			.then(res => {
				console.log("response: ", res)
				alert("Job successfully created")
				history.push("/recruiterdashboard")
			})
			.catch((error) => {
				console.log("error: ", error.response)
				alert("An error occured, please try again")
			})	
	};
	

    const startDatevalidator =()=>{
		return startDate !== "" && today < Date.parse(startDate)
    }
    
   
    const handleSubmit= async (event) =>{	
		event.preventDefault();
		const form = event.currentTarget;
		if (form.checkValidity() === false) {	
			event.stopPropagation();
			setValidated(true);
		}else{
			setValidated(true);
			//good to go
			postOffer();
		}
	}

    
	return (
		<Grid>
			<Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100%',paddingTop: 60}}>
				<Col sm="2">
					<SideMenu random={[
                        {'text':'Job Applications','href': '/applications','active': true},
						{'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': false},
						{'text':'FAQ','href':'#','active': false}]}/>
				</Col>

				<Col sm="10" >
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						Create Offer Letter
					</Typography>

                    <Form noValidate validated={validated} onSubmit={handleSubmit} style={{marginLeft:'15%'}}>          
                        
						
                        
                        
						<Form.Group controlId="description">
							<Form.Label column sm={2}>*Offer Description:</Form.Label>
							<Col sm={10}>
								<Form.Control as="textarea" rows="10" 
								required
								onChange={ (event) => setDescription(event.target.value)}
                                placeholder={default_text} 
                                value={description}/>
							</Col>
						</Form.Group>

                        <h4>Details </h4>
                        <h>Position Title: {title} at {company} </h>
                        <Form.Group controlId="location">
							<Form.Label column sm={2}>*Location: </Form.Label>
							<Col sm={10}>
								<Form.Control 
								required
								value={location}
								onChange={ (event) => setLocation(event.target.value)}/>
							</Col>
						</Form.Group>

                        <Form.Group controlId="startDate">
							<Form.Label column sm={2}>
							*Start Date:</Form.Label>
							<Col sm={10}>
							<TextField 
								className={
									!startDatevalidator()
										? "form-control is-invalid"
										: "form-control"
								}
								id="startDate"
								type="date"
								min={today}
								onChange={ (event) => 
									setStartDate(event.target.value)	
								}
								/>
								<Form.Control.Feedback type="invalid">
									Please enter a date in the future
								</Form.Control.Feedback>
							</Col>
						</Form.Group>


                        <Form.Group controlId="endDate">
							<Form.Label column sm={2}>
							End Date:</Form.Label>
							<Col sm={10}>
							<TextField 
								id="endDate"
								type="date"
								min={startDate}
								onChange={ (event) => 
									setEndDate(event.target.value)	
								}
								/>
								
							</Col>
						</Form.Group>

                        <Form.Group controlId="jobType">
						<Form.Label column sm={2}>*Job Type:</Form.Label>
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

                        <Form.Group controlId="salary">
							<Form.Label column sm={2}>
							 *Your Salary:
							</Form.Label>
							
							<Col sm={10}>
								<InputGroup>
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control 
									value={salary}
									required
									onChange={ (event) => setSalary(event.target.value)}/>
                                   
                                    <Form.Control as="select" 
                                    required
                                    value={jobType}
                                    type="number"
                                    onChange={e=>setJobType(e.target.value)} 
                                    >    
                                        <option value="">--Select-- </option>
                                        <option>p.a (base)</option>
                                        <option>p.a (fixed,includes super)</option>
                                        <option>per hour</option>	

                                    </Form.Control>
									
								</InputGroup>
							</Col>
						</Form.Group>
                        <Form.Group controlId="hours">
							<Form.Label column sm={2}>*Hours: </Form.Label>
							<Col sm={10}>
								<Form.Control 
								required
								value={hours}
								onChange={ (event) => setHours(event.target.value)}/>
							</Col>
						</Form.Group>

                        <Form.Group controlId="days">
							<Form.Label column sm={2}>*Days of Work: </Form.Label>
							<Col sm={10}>
								<Form.Control 
								required
								value={days}
								onChange={ (event) => setDays(event.target.value)}/>
							</Col>
						</Form.Group>

						<Button variant="contained" color="secondary" type="submit" onSubmit={handleSubmit} style={{margin: 20}}>
						Send Offer
						</Button> 
					</Form>  		
				</Col>
			</Row>
		</Grid>
	);
}