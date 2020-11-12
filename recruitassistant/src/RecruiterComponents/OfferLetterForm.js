import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {IconButton,Grid,Button,TextField,FormGroup,FormControlLabel,Switch}
 from "@material-ui/core";
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
export const advertisementUrl="http://localhost:5000/advertisement"
export const applicationsUrl ="http://localhost:5000/jobapplication"

export default function OfferLetterForm(props) {

	//console.log(props.location.state)
	const jobAppID = props.location.state.jobAppID
	const jobID= props.location.state.jobID

	const history = useHistory();
	//date formatting - to be used in offer letter description
	const options = {year: 'numeric', month: 'long', day: 'numeric' };
	const t  = new Date();
	const todays_date=t.toLocaleDateString("en-US", options);

	//Used for form validation
	const [validated, setValidated] = useState(false);

	const [location,setLocation] = useState('');
	const [title,setTitle] = useState('');
	const [company,setCompany] = useState('');	
	const [jobseekerId,setJobSeekerID]=useState('')
	const [fullname, setFullname] = useState('')
	const [description,setDescription] = useState('');
	const [jobType, setJobType]=useState('') 
	//salary 
	const [salary,setSalary] = useState('');
	//type - p.a or hourly
	const [salaryType,setSalaryType] = useState(''); 
	const [startDate, setStartDate]=useState('');
	const [endDate, setEndDate]=useState('n/a');
	//hours per week
	const [hours, setHours]=useState('0 hours per week');
	const [days, setDays]=useState('Monday - Friday');  
	const [additionalDocs, setAdditionalDocs] = useState([]);
	const [counterable, setCounterable]= useState(false)
	
	useEffect(() => {
		auth();
		getJobInfo(jobID);
		getJobSeekerName(jobAppID);
		
	},[]);
	
	//Prefill fields with job ad info
	async function getJobInfo(jobID) {
		await axios.get(advertisementUrl, {params: {job_id: jobID}})
			.then(res => {
				console.log(res.data.job[0][1])
				const job_data = res.data.job[0][1]
				setTitle(job_data["title"]);
				setCompany(job_data["company"]);
				setLocation(job_data["location"]);
				setJobType(job_data["job_type"]);
				setSalary(job_data["salary_pa"]);
				
			}).catch((error) => {
				console.log("error: ", error.response)
				alert("An error occured, please try again")
			})	
	}


	async function getJobSeekerName(jobAppID) {
		await axios.get(applicationsUrl, {params: {jobAppId: jobAppID,jobId: jobID}})
			.then(res => {
				console.log(res.data.application)
				const job_data = res.data.application
				const first=job_data["first_name"]
				const last= job_data["last_name"]
				const full=first+' '+last
				setFullname(full)
				setDescription(`${todays_date}\n\nDear ${full},\n\n    .......`)	
				setJobSeekerID(job_data['jobseeker_id'])
			}).catch((error) => {
				console.log("error: ", error.response)
				alert("An error occured, please try again")
			})	
	}
	
	

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

	//changed to only remove the last document
	const handleRemoveDoc = () => {
		const docs  = [...additionalDocs]	
		//remove doc
		docs.pop()
		setAdditionalDocs(docs)
	}


	const handleChangeDoc = (index,event) => {	
		console.log(index)
		var file=event.target.files[0]
		var filename=event.target.files[0].name
		var filetype= event.target.files[0].type
		console.log(filetype)
		if(filetype!="application/pdf"){
			alert("please upload a pdf")
			return 0
		}
		const reader = new FileReader()
		reader.onload = (e) => handleFileLoad(filename,index,e);
		reader.readAsDataURL(file)
	}

	const handleFileLoad= (filename,index,event)=>{
		var docs = [...additionalDocs]
		docs[index]={'filename': filename, 'src': event.target.result}
		console.log(event.target.result); 
		setAdditionalDocs(docs)
	}


	const postOffer = async () => {
		const url = offerURL
		const data={
			title:title,
			location:location,
			description: description,
			company:company,
			recruiter_id: sessionStorage.getItem("uid"),
			jobapplication_id: jobAppID,
			jobadvert_id: jobID,
			jobseeker_id: jobseekerId,
			full_name: fullname,
			job_type: jobType,
			salary: salary,
			salary_type: salaryType,
			hours: hours,
			days: days,
			start_date: startDate,
			end_date: endDate,
			status: 'sent', //status of the offer can be sent (first time, or in respnse to counter offer), accepted,rejected
			additional_docs: additionalDocs,
			counterable: counterable
		}
		console.log(data)
		await axios.post(url, data)
			.then(res => {
				console.log("response: ", res)
				alert("Offer successfully sent")
				history.push("/recruiterdashboard")
			})
			.catch((error) => {
				console.log("error: ", error.response)
				alert("An error occured, please try again")
			})	
	};
	

	//check start date is after todays date
	const startDatevalidator =()=>{
		return startDate !== "" && t < Date.parse(startDate)
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
			<Row noGutters fluid><TitleBar name={window.localStorage.getItem("name")}/></Row>
			<Row noGutters style={{height:'100%',paddingTop: 60}}>
				<Col sm="2">
					<SideMenu random={[
						{'text':'Job Applications','href': `/applications/${jobID}`,'active': true},
						{'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': false},
						{'text':'FAQ','href':'/recruiterFAQ','active': false}]}/>
				</Col>
				
				<Col sm="10" >
					<a href={`/advertisement/${jobID}`} target="_blank" style={{textAlign: "center",margin:20 }}> View Original Job Advert</a>
				
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						Create Offer Letter
						
					</Typography>
					
   
					<Form noValidate validated={validated} onSubmit={handleSubmit} style={{marginLeft:'15%'}}>          
						<Form.Group controlId="counterable">
						<FormControlLabel
							control={<Switch checked={counterable} onChange={()=> setCounterable(!counterable)} />}
							label="Allow counter offers"
						/>
						</Form.Group>
					
						<h4>Offer Description</h4>
						<Form.Group controlId="description">
							<Col sm={10}>
								<Form.Control as="textarea" rows="10" 
								required
								onChange={ (event) => setDescription(event.target.value)}                              
								value={description}/>
							</Col>
						</Form.Group>
						<br/>
						<h4>Details </h4>
						<Form.Label column sm={12}>Position Title: {title} at {company} </Form.Label>
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
							className={ !startDatevalidator()
								? "form-control is-invalid"
								: "form-control"
							}
							id="startDate"
							type="date"
							min={t}
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
							 *Renumeration:
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
									type="number"
									onChange={e=>setSalaryType(e.target.value)} 
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

						<Form.Group controlId="additionalDocs">
							<Form.Label column sm={2}>
							Additional Documents
							</Form.Label>
							<IconButton onClick={() => handleAddDoc()}>
								<AddIcon />
							</IconButton>
							<Col sm={10}>
							{additionalDocs.map((doc, index) => (
								<div key={index}>
									<Form.File
									key = {index}
									accept="application/pdf"
									onChange = {(e)=>handleChangeDoc(index,e)} 
									/>
								
								</div>
							))}	

							{ additionalDocs.length > 0 &&
								<IconButton onClick={() => handleRemoveDoc()}>
										<RemoveIcon />
								</IconButton>
							}		
							
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