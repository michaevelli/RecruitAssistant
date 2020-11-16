import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {IconButton,Grid,Button,TextField,Snackbar,CircularProgress} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import {Form,InputGroup,Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const offerdetailsurl="http://localhost:5000/getOfferDetails"
export const editofferurl="http://localhost:5000/editoffer"


export default function EditOffer({match}) {
	const offerID = match.params.offerID;
	const jobID = match.params.jobID;
	const [loading, setLoading] = useState(true);
	const [recruiterID, setRecruiterID] = useState('');
	const [jobseekerID,setJobSeekerID]=useState('');
	const [jobAppID, setJobAppID] = useState('');
	const [fullName, setFullName] = useState('');

	const history = useHistory();
	const t  = new Date();
	//Used for form validation
	const [validated, setValidated] = useState(false);
	const [submitted, setSubmitted] = useState(false)
	const [open, setOpen] = useState(false)
	const [disable, setDisable] = useState(false)
	const [message, setMessage] = useState('')

	// offer letter form fields
	const [location,setLocation] = useState('');
	const [title,setTitle] = useState('');
	const [company,setCompany] = useState('');
	const [description,setDescription] = useState('');
	const [jobType, setJobType]=useState('') 
	const [salary,setSalary] = useState('');
	const [salaryType,setSalaryType] = useState('');
	const [startDate, setStartDate]=useState('');
	const [endDate, setEndDate]=useState('n/a');
	const [hours, setHours]=useState('0 hours per week');
	const [days, setDays]=useState('Monday - Friday');  
	const [additionalDocs, setAdditionalDocs] = useState([]);
	const [counterable, setCounterable]= useState(false)
	
	useEffect(() => {
		auth();
		getOfferInfo();
	},[]); // eslint-disable-line react-hooks/exhaustive-deps
	
	async function getOfferInfo() {
		await axios.post(offerdetailsurl, {offerId: offerID})
			.then(res => {
				const offer = res.data.offer
				setJobSeekerID(offer.jobseeker_id)
				setRecruiterID(offer.recruiter_id)
				setFullName(offer.full_name)
				setJobAppID(offer.application_id)
				setTitle(offer.title);
				setCompany(offer.company);
				setDescription(offer.description)
				setLocation(offer.location);
				setJobType(offer.job_type);
				setSalary(offer.salary);
				setSalaryType(offer.salary_type);
				setStartDate(offer.start_date);
				setEndDate(offer.end_date)
				setHours(offer.hours)
				setDays(offer.days)
				setCounterable(offer.counterable)
				if (offer.additional_docs != null) {
					setAdditionalDocs(offer.additional_docs)
				}
				setLoading(false)
				
			}).catch((error) => {
				console.log("error: ", error.response)
				setMessage("An error occured, please try again")
				setOpen(true)
			})	
	}	
	

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				if (!response.success || response.userInfo["type"] !== 'recruiter') {
					history.push("/unauthorised");
				}
			})
	}
	
	// --- handle document upload ---

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
			reader.onload = (e) => handleFileLoad(filename,index,e);
			reader.readAsDataURL(file)
		} else {
			var docs = [...additionalDocs]
			docs[index] = {'filename': '', 'src': undefined}
			setAdditionalDocs(docs)
		}
		
	}

	const handleFileLoad= (filename,index,event)=>{
		var docs = [...additionalDocs]
		docs[index]={'filename': filename, 'src': event.target.result}
		console.log(event.target.result); 
		setAdditionalDocs(docs)
	}

	const handleClose = () => {
		setOpen(false)
		if (message === "Edited offer successfully sent") {
			history.push("/recruiterdashboard")
		}
	}

	// --- submit edited offer to database ---
	const postOffer = async () => {
		const data={
			offerid: offerID,
			title:title,
			location:location,
			description: description,
			company:company,
			recruiter_id: recruiterID,
			jobapplication_id: jobAppID,
			job_id: jobID,
			jobseeker_id: jobseekerID,
			full_name: fullName,
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
		await axios.post(editofferurl, data)
			.then(res => {
				console.log("response: ", res)
				setMessage("Edited offer successfully sent")
				setOpen(true)
				setDisable(true)
			})
			.catch((error) => {
				console.log("error: ", error.response)
				setMessage("An error occured, please try again")
				setOpen(true)
			})	
	};
	

	//check start date is after todays date
	const startDatevalidator =()=>{
		return startDate !== "" && t < Date.parse(startDate)
	}
	
   
	const handleSubmit= async (event) =>{	
		event.preventDefault();
		setSubmitted(true)
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

	
	return loading ? (
		<div style={{
			position: 'absolute', left: '50%', top: '50%',
			transform: 'translate(-50%, -50%)'
			}}>
			<CircularProgress/>
		</div>
	) : (
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
			<Row noGutters style={{height:'100%',paddingTop: 60}}>
				<Col sm="2">
					<SideMenu random={[
						
						{'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': false},
						{'text': title,'href': '#','active': false,
						'nested':[
							{'text':'Applications','href': `/applications/${jobID}`,'active': false},
							{'text':'Interviews','href': `/interviews/${jobID}`,'active': false},
							{'text':'Offers','href': `/offers/${jobID}`,'active': true},
							{'text': 'Statistics','href': `/jobstatistics/${jobID}`,'active': false},
							]},
						{'text':'FAQ','href':'/recruiterFAQ','active': false}]}/>
				</Col>
				
				<Col sm="10" >				
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						Edit Offer Letter
					</Typography>
   
					<Form noValidate validated={validated} onSubmit={handleSubmit} style={{marginLeft:'15%'}}>          
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
							value={startDate}
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
								value={endDate}
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
									value={salaryType}
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
							<Form.Label column sm={4}>
							Additional Documents
							</Form.Label>
							<IconButton onClick={() => handleAddDoc()}>
								<AddIcon />
							</IconButton>
							<Col sm={10}>
							{additionalDocs.map((doc, index) => (
								<div key={index}>
									<Form.File
									required = {(additionalDocs[index] === '' || additionalDocs[index]["filename"] === '' || typeof additionalDocs[index] === "undefined")}
									key = {index}
									label = {doc.filename}
									accept="application/pdf"
									onChange = {(e)=>handleChangeDoc(index,e)} 
									/>
									{submitted && (additionalDocs[index] === '' || additionalDocs[index]["filename"] === '' || typeof additionalDocs[index] === "undefined")?(<span style={{color:"red"}}>Please upload a pdf file</span>):(<div></div>)}
								</div>
							))}	

							{ additionalDocs.length > 0 &&
								<IconButton onClick={() => handleRemoveDoc()}>
										<RemoveIcon />
								</IconButton>
							}		
							
							</Col>
											
						</Form.Group>

						<Button disabled={disable} variant="contained" color="secondary" type="submit" onSubmit={handleSubmit} style={{margin: 20}}>
						Send Offer
						</Button> 
					</Form>  		
				</Col>
			</Row>
		</Grid>
	);
}