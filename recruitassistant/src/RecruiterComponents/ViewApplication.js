import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link, Grid, Divider, CircularProgress, Typography} from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import {Col,Row} from 'react-bootstrap';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";


export const jobUrl="http://localhost:5000/retrieveapplication"

export default function ViewApplication() {
	const history = useHistory();
	const href = `${window.location.href}`.split("/")
	const applicationID = href[href.length - 1]
	const jobID = href[href.length - 2]
	const [application, setApp] = useState({})
	const [job, setJob] = useState({})
	const [qualifications, setQualifications] = useState([])
	const [answers, setAnswers] = useState([])
	const [documentsList, setDocumentsList] = useState([])
	const [loading,setLoading]= useState(true)
	const [usertype, setUsertype] = useState("")

	useEffect(() => {
		auth();
		getApplication();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const auth = async () => {
		console.log(applicationID)
		console.log(jobID)
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				if (response.userInfo["type"] === "recruiter") {
					setUsertype("recruiter")
				} else if (response.userInfo["type"] === "jobseeker") {
					setUsertype("jobseeker")
				}
				if (!response.success) {
					history.push("/unauthorised");
				}
			})
	}

	const getApplication = async () => {
		await axios.get(jobUrl, {
			params: {
				app_id: applicationID,
				job_id: jobID,
			},
		})
		.then(res => {
			initialise(res.data)
			// console.log("response: ", res.data.applications)
			// console.log("response: ", res.data.jobinfo)
		})
		.catch((error) => {
			console.log("error: ", error.response)
		})

	}

	const initialise = (data) => {
		setJob(data.jobinfo)
		setApp(data.applications)
		if (data.jobinfo.req_qualifications){
			setQualifications( data.jobinfo.req_qualifications)
		}else{
			setQualifications([])
		}
		if (data.applications.answers){
			setAnswers(data.applications.answers)
		}else{
			setAnswers([])
		}
		if (data.applications.submitted_docs){
			setDocumentsList(data.applications.submitted_docs)
		}else{
			setDocumentsList([])
		}
		setLoading(false)
	}
	//example of how to download a pdf in browser
	const downloadFile = async (data,filename) =>{		
		
		const linkSource = data;
		const downloadLink = document.createElement("a");
		const fileName = filename;
	
		downloadLink.href = linkSource;
		downloadLink.download = fileName;
		downloadLink.click();	
		
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
					{usertype==="jobseeker"?
					( <SideMenu random={[{'text':'Job Seeker Dashboard','href': '/jobseekerdashboard', 'active': true},
						{'text':'Your Applications','href': '/yourapplications', 'active': false},       
						{'text':'FAQ','href':'/jobseekerFAQ','active': false}]}/>
					) : (
					<SideMenu random={[
						{'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': false},
						{'text': job.title,'href': '#','active': false,
						'nested':[
							{'text':'Applications','href': `/applications/${jobID}`,'active': true},
							{'text':'Interviews','href': `/interviews/${jobID}`,'active': false},
							{'text':'Offers','href': `/offers/${jobID}`,'active': false},
							{'text': 'Statistics','href': `/jobstatistics/${jobID}`,'active': false},
							]},
						{'text':'FAQ','href':'/recruiterFAQ','active': false}]}/>)
					}
				</Col >
				<Col sm ={6} style={{display:'flex', justifyContent:'center'}}>
					<Typography component="div" style={{color: 'black', margin: 50, width:'80%'}}>
						<Typography variant='h5'>{application.first_name} {application.last_name}</Typography>
						<Typography variant='subtitle1'>Application for {job.title}</Typography>
						<Typography variant='subtitle1'>Contact number: {application.phone_number}</Typography>
						<br/><Divider/><br/>
						<Typography variant='body1'>Qualifications ({application.qualities_met} of {qualifications.length}):</Typography>
						<br/>
						<Typography variant='body1'>
							{qualifications.map((quality) => (
								<ul>
									<CheckIcon hidden = {!application.qualifications.includes(quality)}/>
									<ClearIcon hidden = {application.qualifications.includes(quality)}/>
									&nbsp;&nbsp;&nbsp;{quality}
								</ul>
							))}
						</Typography>
						<br/>
						<Typography variant='body1'>
							{application.rights==='Yes'?<ClearIcon/>:<CheckIcon/>} Working rights in {job.location}
						</Typography>
						{answers.length>0 && (<div><br/><Divider/><br/></div>)}
						<Typography variant='body1'>{answers.length>0 && 'Responses to questions:'}</Typography>
						<br/>
						<Typography variant='body1'>
							<ol> 
								{answers.map((answer, index) => (
									<li><b>{job.additional_questions[index]}</b>
									<p>{answer}</p>
									</li>
								))}
							</ol>
						</Typography>
						{documentsList.length>0 && (<div><br/><Divider/><br/></div>)}
						<Typography variant='body1'>{documentsList.length>0 && 'Submitted documents'}</Typography>
						<br/>
						<Typography variant='body1'>
							{documentsList.map((document) => (
								<ul>
									<Link style={{ cursor: 'pointer'}} onClick={()=>downloadFile(document.src,document.filename)} target="_blank">
										<PictureAsPdfIcon color = "secondary"/>{document.req_document}
									</Link>
								</ul>
							))}
						</Typography>
					</Typography>					
				</Col>
			</Row>
		</Grid>
	)
}


