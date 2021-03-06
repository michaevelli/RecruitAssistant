import React, { useState,useEffect,useLayoutEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Grid,Button,TextField,Snackbar,IconButton,Divider} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close"
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import {Col,Row,Alert} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";
import Link from '@material-ui/core/Link';

export const interviewURL ="http://localhost:5000/interviews"

export default function InterviewPage({match}) {
	const history = useHistory()
	const interviewID = match.params.interviewID;
   
	const [status, setStatus]= useState('')
	const [time, setTime]= useState('')
	const [date, setDate]= useState('')
	const [reason, setReason] = useState('')
	const [loading, setLoading]=useState(true)
	const [show, setShow] = useState('none')
	const [details, setDetails] = useState('')
	const [email, setEmail] = useState('')
	const [joblink, setlink] = useState('')

	//for alert bar
	const [desc, setDesc] = useState('')
	const [variant, setVariant]=useState('')
	const [open, setOpen] = useState(false);
	const [openError, setOpenError] = useState(false)
  
	useEffect(() => {
		auth();
		getInterviewDetails();
	},[]); // eslint-disable-line react-hooks/exhaustive-deps

	useLayoutEffect(() => {
		updateAlert()
	},[status, reason]); // eslint-disable-line react-hooks/exhaustive-deps

	//update color/text of alert bar
	const updateAlert = ()=>{
		if(status==='Accepted'){
			setVariant('success')	
			setDesc("Interview invite has been accepted.")
		}
		else if(status==='Declined'){
			setVariant('secondary')
			if(reason===''){
				setDesc("Interview invite has been declined.")
			} else {
				setDesc("Interview invite has been declined with reason: '" + reason + "'")
			}
		}else{
			setVariant('info')	
			setDesc("Please respond to interview invite.")
		}
		setOpen(true)
	}
	
	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				// const recruiterID = sessionStorage.getItem("uid")			
				if (!response.success || response.userInfo["type"] !== "jobseeker") {
					history.push("/unauthorised");
				}
			})
	}

	const getInterviewDetails = async () => {
		await axios.get(`${interviewURL}/${interviewID}`)
		.then(res => {   
			const interview_data = res.data.interview
			console.log(interview_data)
			setDate(interview_data["interview_date"]);
			setTime(interview_data["interview_time"]);
			setStatus(interview_data["status"] || 'Pending'); 
			setReason(interview_data["reason"] || ''); 
			setDetails(interview_data["interview_details"] || '');
			setlink('http://localhost:3000/advertisement/' + interview_data['job_id']);
			setEmail(interview_data['recruiter_email']|| '')
			
		}).catch((error) => {
			console.log("error: ", error.response)
			history.push('/*')
		})	
		setLoading(false)
	}

   
	//response can be "Accepted" or "Declined"
	const handleResponse = async (response) => {
		setLoading(true)
		//update interview status
		var givenreason = reason
		if (response === "Accepted") {
			givenreason = ""
			setShow('none')
		}
		await axios.patch(interviewURL, {'status': response, 'id':interviewID, 'reason': givenreason})
		.then(res => {
			console.log("response: ", res)
			window.location.reload()
			setLoading(false)
		})
		.catch((error) => {
			console.log("error: ", error.response)
			setOpenError(true)
		})	
		
	}

	//if status is pending give option to accept/decline
	//else simply show the date and time info
	const renderInterviewInfo = () => {
		return (
		<div>
		<Snackbar
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			open={openError}
			autoHideDuration={5000}
			onClose={() => setOpenError(false)}
			message="An error occurred, please try again"
			action={
				<IconButton size="small" aria-label="close" color="inherit" onClick={() => setOpenError(false)}>
					<CloseIcon fontSize="small" />
				</IconButton>
			}
		/>
		<Alert style={{visibility: (open? 'visible':'hidden'), margin:10}}  variant={variant} >
			{desc}
		</Alert>
		<Typography component="div" style={{color: 'black', margin: 50, textAlign:'center'}}>
			<Typography variant='h5'>Interview Details</Typography>
			<br/>
			<Divider/>
			<br/>
			<Typography variant='body1'>Congratulations! You have received an interview invite:</Typography>
			<br/>
			<Typography variant='body1'>Date: {date}</Typography>
			<Typography variant='body1'>Time: {time}</Typography>
			<br/>
			<Typography variant='body1'>{details !== '' && ('Details: ' + details)}</Typography>
			<br/>{email !== '' && <Divider/>}<br/>
			<Typography variant='body1'>{email !== '' && ('Feel free to contact your recruiter if you have any questions at ' + email)}</Typography>
			<br/><Divider/><br/>
			<Link href={joblink}>View original job posting</Link>
			{status==="Pending" &&
			<Box style={{marginTop: 50}}>
				<Button variant="contained"  color="secondary" style={{marginRight:30,backgroundColor: 'green'}} onClick={()=>handleResponse("Accepted")}>
				Accept
				</Button>
				<Button variant="contained" color="secondary" onClick={()=>setShow(show==='none'? 'block': 'none')}>
				Decline
				</Button>
			</Box>
			}
		</Typography>
		</div> )
	}
	
	//field showing up when declined
	const renderDecline = () => {
		return (
			<div style={{display: show, color: 'black', margin: 50, textAlign:'center'}}>
				<p>Optionally provide a reason (up to 70 characters) for declining and confirm you want to decline the interview.</p>
				<div>
					<TextField
						name = "Reason"
						variant = "outlined"
						inputProps={{maxLength: 70}}
						style = {{width: 750, marginRight: 50}}
						value = {reason}
						placeholder = "Optional reason (up to 70 characters)"
						onChange = { (event) => setReason(event.target.value)}/>
					<Button onClick={() => handleResponse("Declined")} variant = "contained" color="secondary" style = {{marginTop: 8.5}}>
						Confirm
					</Button>
				</div>
			</div>
		)
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
			<Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 60}}>
				<Col sm={2}>
					<SideMenu random={[
						{'text':'Job Seeker Dashboard','href': '/jobseekerdashboard', 'active': false},
						{'text':'Your Applications','href': '/yourapplications', 'active': true},         
						{'text':'FAQ','href':'/jobseekerFAQ','active': false}]}/>
				</Col >
				<Col sm={9}>	
				{renderInterviewInfo()}
				{renderDecline()}
				</Col>
			</Row>
		</Grid> 
	)
}
  
  
