import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Button, Grid} from "@material-ui/core";
import {Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const applicationUrl="http://localhost:5000/jobapplications"
export const advertisementUrl="http://localhost:5000/advertisement"

export default function Advertisement() {

	const history = useHistory();
	const [loading, setLoading] = useState(true);
	const href = `${window.location.href}`.split("/")
	const jobID = href[href.length - 1]
	const [applied, setApplied] = useState(false);
	const [job, setJob] = useState([])
	const [recruiter, setRecruiter] = useState(false);

	useEffect(() => {
		auth();
		getJob();
		checkJobApplied();
	}, []);

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				
				//Both recruiters and job seekers should be able to view an advert
				if (!response.success) {
					history.push("/unauthorised");
				}
				if (response.userInfo["type"] == "recruiter") {
					//hide apply button and side menu, just show the ad
					setRecruiter(true)
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
				<Col>
					<Typography component="div" style={{color: 'black', margin: 50}}>
						<Box fontSize="h3.fontSize" fontWeight="fontWeightBold">
							{detail[1].title}
						</Box>
						<Box fontSize="h5.fontSize">
							{detail[1].company} | {detail[1].location}
						</Box>
						<Box fontSize="h6.fontSize" lineHeight={2}>
							{detail[1].job_type}
						</Box>
						<Box fontSize="h6.fontSize" lineHeight={2} >
							Remuneration: ${detail[1].salary_pa * 1000}
						</Box>
						<br/>
						<Box fontSize="h6.fontSize" >
							{detail[1].description}
						</Box>
						<br/>
						<Box fontSize="h6.fontSize" lineHeight={2}>
							Responsibilities:
							{renderListItems(detail[1].responsibilities)}
						</Box>
						<Box fontSize="h6.fontSize" lineHeight={2}>
							Qualifications:
							{renderListItems(detail[1].req_qualifications)}
						</Box>
						<Box fontSize="h6.fontSize" lineHeight={2}>
							Experience level: {detail[1].experience_level}
						</Box>
						<Box fontSize="h6.fontSize" lineHeight={2}>
							Closing date: {detail[1].closing_date}
						</Box>
					</Typography>
					<Button disabled={applied || recruiter || detail[1].status =='closed'} variant="contained" color="secondary" href={`/jobapply/${detail[0]}`} style={{margin: 40}}>
						Apply
					</Button>
				</Col>
			))
		);
	}

	return recruiter ? (
		<Grid>
		<Row noGutters fluid><TitleBar name={window.localStorage.getItem("name")}/></Row>
		<Row noGutters style={{height:'100vh',paddingTop: 60}}>
			<Col sm={2}>
				<SideMenu random={[
                    {'text':'Recruiter Dashboard','href': '/recruiterdashboard', 'active': false},   
                    {'text':'FAQ','href':'/recruiterFAQ','active': false}]}/>
			</Col >
			{advertPanel()}
		</Row>
	</Grid>
	) : (
		<Grid>      
			<Row noGutters fluid><TitleBar name={window.localStorage.getItem("name")}/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 60}}>
				<Col sm={2}>
					<SideMenu random={[
						{'text':'Job Seeker Dashboard','href': '/jobseekerdashboard', 'active': true},
						{'text':'Your Applications','href': '/yourapplications', 'active': false},         
						{'text':'FAQ','href':'/jobseekerFAQ','active': false}]}/>
				</Col >
				{advertPanel()}
			</Row>
		</Grid>
	);
}