import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Button, Grid, CircularProgress, Divider, Typography} from "@material-ui/core";
import {Col,Row, Card, Table} from 'react-bootstrap';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import checkAuth from "../Authentication/Authenticate";

export const applicationUrl="http://localhost:5000/jobapplications"
export const advertisementUrl="http://localhost:5000/advertisement"

export default function Advertisement() {
	const [loading, setLoading] = useState(true);
	const href = `${window.location.href}`.split("/")
	const jobID = href[href.length - 1]
	const [applied, setApplied] = useState(false);
	const [job, setJob] = useState([])
	const [userType, setUserType] = useState('');

	useEffect(() => {
		auth();
		getJob();
		checkJobApplied();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				
				//Public users, recruiters, and job seekers should be able to view an advert
				if (!response.success) {
					window.sessionStorage.clear()
					window.localStorage.clear()
					setUserType('public')
				} else if (response.userInfo["type"] === "recruiter") {
					//hide apply button and side menu, just show the ad
					setUserType('recruiter')
				} else if (response.userInfo["type"] === "admin") {
					setUserType('admin')
				} else {
					setUserType('jobseeker')
				}
				setLoading(false)
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

	const checkJobApplied = async () => {
		const url = `${applicationUrl}`
		console.log(url)
		await axios.get(url, {
				params: {
					job_id: jobID,
					jobseeker_id: sessionStorage.getItem("uid")
				},
			})
			.then(res => {
				setApplied(res.data.applied)
				console.log("response: ", res)
			})
			.catch((error) => {
				console.log("error: ", error.response)
			})
	};

	const renderListItems = (field) => {
		if (field == null) {
			return <div></div>
		} else {
			var item = [...field]
			return (
				item.map((i) => (
					<ul>
						<li> {i} </li>
					</ul>
				))
			)
		}
	}
	const advertPanel = () =>{
		
		return (
			job.map((detail) => (
				<Row>
					<Col xs={1}></Col>
					<Col xs={6}>
						<Typography component="div" style={{color: 'black', margin: 50}}>
							<Typography variant='h5'>{detail[1].title}</Typography>
							<Typography variant='subtitle1'>{detail[1].company}</Typography>
							<br/>
							<Divider/>
							<br/>
							<Typography variant='body1'>{detail[1].description}</Typography>
							<br/>{detail[1].responsibilities != null && <Divider/>}<br/>
							<Typography variant='body1'>{detail[1].responsibilities != null && 'Job Responsibilities:'}</Typography>
							<Typography variant='body1'>{renderListItems(detail[1].responsibilities)}</Typography>
							<br/>{detail[1].req_qualifications != null && <Divider/>}<br/>
							<Typography variant='body1'>{detail[1].req_qualifications != null && 'Desired qualifications:'}</Typography>
							<Typography variant='body1'>{renderListItems(detail[1].req_qualifications)}</Typography>
						</Typography>
						
					</Col>
					<Col xs={5} style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
						<Row style={{height:450,width:'80%',position:'absolute', top:80}}>
							<Card border='success'style={{width:'100%'}}>
								<Card.Body>
									<Card.Title>Job Details</Card.Title>
									<Table borderless hover  style={{tableLayout: 'fixed'}}>
										<tbody>
											<tr><td>Location: </td><td>{detail[1].location}</td></tr>
											<tr><td>Job Type: </td><td>{detail[1].job_type}</td></tr>
											<tr><td>Renumeration: </td><td>${detail[1].salary_pa}</td></tr>
											<tr><td>Experience: </td><td>{detail[1].experience_level}</td></tr>
											<tr><td>Closing date: </td><td>{detail[1].closing_date}</td></tr>
										</tbody>
									</Table>
								</Card.Body>
								{userType==='jobseeker' ? (
									<Button disabled={applied || detail[1].status ==='closed'} variant="contained" color="secondary" href={`/jobapply/${detail[0]}`} style={{margin: 40}}>
										Apply Now
									</Button>
								) : ( userType==='public' && (
									<Typography variant="h6" style={{color: '#348360', textAlign: "center",margin:20 }}>
										<a href="/login">Log in to apply to this job!</a>
									</Typography>
									)
								)}
							</Card>
						</Row>
					</Col>
				</Row>
			))
		);
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
			<Row noGutters fluid><TitleBar name={window.localStorage.getItem("name")}/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 60}}>
				<Col sm={2}>
					{userType==='jobseeker' ? (
							<SideMenu random={[
								{'text':'Job Seeker Dashboard','href': '/jobseekerdashboard', 'active': true},
								{'text':'Your Applications','href': '/yourapplications', 'active': false},       
								{'text':'FAQ','href':'/jobseekerFAQ','active': false}]}/>
						) : ( userType==='recruiter' ? (
							<SideMenu random={[
								{'text':'Recruiter Dashboard','href': '/recruiterdashboard', 'active': true},
								{'text':'FAQ','href':'/recruiterFAQ','active': false}]}/>
						) : ( userType==='admin' ? (
							<SideMenu random={[
								{'text':'Jobs','href': '/admindashboard', 'active': true},
								{'text':'Users','href': '/admin/userlist', 'active': false}]}/>
						) : (
							<SideMenu random={[
								{'text':'Home','href': '/', 'active': false},
								{'text':'Browse Jobs','href': '/jobseekerdashboard', 'active': true}]}/>
						)))}
				</Col >
				<Col sm={10}>{advertPanel()}</Col>
			</Row>
		</Grid>
	);
}