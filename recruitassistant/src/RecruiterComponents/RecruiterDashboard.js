import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link, Button, Grid,Card,CardContent,CardActions } from "@material-ui/core";
import {Container,Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";

export const jobUrl="http://localhost:5000/jobadverts/"

export default function RecruiterDashboard() {
	const recruiterID = "1234";
	const [jobs, setJobs] = useState([])

	useEffect(() => {
    getJobs();
  }, []);

	const getJobs = async () => {
		const url = jobUrl+recruiterID
		await axios.get(url)
			.then(res => {
				setJobs(res.data.jobs)
				console.log("response: ", res)
			})
			.catch((error) => {
				console.log("error: ", error.response)
			})
	};

	const renderJobs = () => {
		return jobs.map((job) => (
			<Card style={{margin: 30, height: 150, width:250}}>
				<CardContent>                          
					<Typography variant="h5" component="h2">
						{job[1].title}
					</Typography>
					<Typography color="textSecondary">
						{job[1].company} | {job[1].location}
					</Typography>
				</CardContent>
				<CardActions>
					<Typography color="textSecondary">
						{job[1].status}
					</Typography>
					<Link href="/sampleapplicationdash" style={{marginLeft: 30}} >
							View applications
					</Link>
				</CardActions>
			</Card>
		))
	}

	return (
		<Grid>
			<Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 40}}>
				<Col sm="2">
					<SideMenu random={[
						{'text':'Recruiter Dashboard','href': '#','active': true},
						{'text':'FAQ','href':'#','active': false}]}/>
				</Col>

				<Col sm="9">
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						Your Jobs
					</Typography>
					<div className="card-deck"  style={{ display: 'flex', flexWrap: 'wrap',justifyContent: 'normal', paddingLeft:'5%'}}>
						{renderJobs()}
					</div>
				</Col>
					
				<Col>
					<Button variant="contained" color="secondary" href="/createJobPost" style={{position: 'fixed', right: 0, top: 20, margin: 30}}>
						+ Job
					</Button>               
				</Col>
			</Row>
		</Grid>
	);
}