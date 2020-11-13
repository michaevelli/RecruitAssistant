import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import { Grid } from "@material-ui/core";
import {Col, Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import { DataGrid } from '@material-ui/data-grid';
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const advertisementUrl="http://localhost:5000/advertisement"
export const interviewUrl="http://localhost:5000/interviewslist"

export default function InterviewList({match}) {
	const jobID = match.params.jobID;
	const recruiterID = sessionStorage.getItem("uid")
	const history = useHistory();
	const [loading, setLoading] = useState(true);
	const [interviews, setInterviews] = useState([])
	const [job, setJob] = useState([])

	const columns = [
		{ field: 'candidate', headerName: 'Candidate', width: 200 },
		{ field: 'datetime', headerName: 'Date & Time', type: 'dateTime', width: 150 },
		{ field: 'status', headerName: 'Status', width: 100 },
		{ field: 'reason', headerName: 'Reason', width: 470, resizable: true, sortable: false },
	];

	useEffect(() => {
		auth();
		getJob();
		getInterviews();
	}, [recruiterID]);

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				setLoading(false)
				if (!response.success || response.userInfo["type"] != "recruiter") {
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

	const getInterviews = async () => {
		const url = `${interviewUrl}`
		console.log(url)
		await axios.get(url, {
			params: {
				job_id: jobID
			},
		})
			.then(res => {
				setInterviews(res.data.interviews)
				console.log("response: ", res)
			})
			.catch((error) => {
				console.log("error: ", error.response)
			})
	};

	const returnFull = (string1, string2) => {
		return string1 + " " + string2
	};

	const renderInterviews = () => {
		const rows = []
		interviews.map((interview) => (
			rows.push({
				id: interview[0],
				candidate: returnFull(interview[1].first_name, interview[1].last_name),
				datetime: returnFull(interview[1].interview_date, interview[1].interview_time),
				status: interview[1].status,
				reason: interview[1].reason})
		))
		return rows
	};

	return loading ? (
		<div></div>
	) : (
		job.map((detail) => (
			<Grid>
				<Row noGutters fluid><TitleBar name={window.localStorage.getItem("name")}/></Row>
				<Row noGutters style={{height:'100vh',paddingTop: 60}}>
					<Col sm="2">
					<SideMenu random={[
						{'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': false},
						{'text': 'Job View','href': '#','active': false,
						'nested':[
							{'text':'Applications','href': `/applications/${jobID}`,'active': false},
							{'text':'Interviews','href': `/interviews/${jobID}`,'active': true},
							{'text':'Offers','href': `/offers/${jobID}`,'active': false},
							{'text': 'Statistics','href': `/jobstatistics/${jobID}`,'active': false},
						]},
						{'text':'FAQ','href':'/recruiterFAQ','active': false}]}/>
					</Col>

					<Col sm="9">
						<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
							{detail[1].title} @ {detail[1].company}
						</Typography>
						<Row>
							<div style={{ height: 600, width: '100%', marginLeft: 100 }}>
								<DataGrid rows={renderInterviews()} columns={columns} disableColumnResize={true} disableSelectionOnClick={true} pageSize={10}/>
							</div>
						</Row>
					</Col>
				</Row>
			</Grid>
		))
	);
}