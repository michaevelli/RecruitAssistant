import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link,Slider, Grid,Card,CardContent,Button,CardActions ,TextField,FormControl,InputLabel,MenuItem,Select} from "@material-ui/core";
import {Form,Container,Col,Row,Collapse} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const jobUrl="http://localhost:5000/jobadverts/"
export const searchUrl="http://localhost:5000/search/"

export default function JobSeekerDashboard() {
	const history = useHistory();
	const [loading, setLoading] = useState(true);
	const [searchString,setSearchString] = useState('');
	const [location,setLocation] = useState('');
	const [jobType,setJobType] = useState('');
	const [experienceLevel,setExperienceLevel] = useState('');
	//salary range units are in k/$1000
	const [salaryRange,setSalaryRange] = useState([0,200]);
	//open is used to toggle advanced filters div
	const [open, setOpen]=useState(false)
	const [jobs, setJobs]=useState([])

	//marks are labels on the salary range slider
	const marks = [
		{value: 0,label: '0k',},{value: 20,label: '20k',},{value: 40,label: '40k',},
		{value: 60,label: '60k',},{value: 80,label: '80k',},{value: 100,label: '100k',},
		{value: 120,label: '120k',},{value: 140,label: '140k',},{value: 160,label: '160k',},
		{value: 180,label: '180k',},{value: 200,label: '200k+',}];
	
	useEffect(() => {
		auth();
		getJobs();
	}, []);

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				setLoading(false)				
				if (!response.success || response.userInfo["type"] != "jobseeker") {
					history.push("/unauthorised");
				}
			})
	}

	const getJobs = async () => {
		const url = `${jobUrl}open`
		console.log(url)
		await axios.get(url)
			.then(res => {
				setJobs(res.data.jobs)
				console.log("response: ", res)
			})
			.catch((error) => {
				console.log("error: ", error.response)
			})
	};

	const handleSubmit= async (event) =>{
			event.preventDefault();
			const url = `${jobUrl}search`
			//TODO
			const ndata={
				search: searchString,
				location: location,
				exp: experienceLevel,
				jobtype: jobType,
				salaryrange: salaryRange		
			};
			console.log(ndata)
			axios.post(url, ndata)
				.then(function(response) {
					setJobs(response.data.jobs)
					console.log(response)
				})
				.catch(function(error) {
					console.log(error.response)
				})
			
	}
	const handleSliderChange = (event, newValue) => {
		setSalaryRange(newValue);
	}

	const handleToggleFilters = () => {
		setOpen(!open)
		//reset search criteria when toggle closed again
		setJobType('')
		setExperienceLevel('')
		setSalaryRange([0,200])
	}

	const renderJobs = () => {
		return jobs.map((job) => (
			<Card style={{margin: 30, height: 180, width:250}}>
				<CardContent>                          
					<Typography variant="h5" component="h2">
						{job[1].title}
					</Typography>
					<Typography color="textSecondary">
						{job[1].company} | {job[1].location}
					</Typography>
				</CardContent>
				<CardActions >
					<Typography 
					style={ job[1].status=='open'? 
					{color: 'green'} : {color:'red'}}>
						{job[1].status}
					</Typography>
					<Link href= {`/advertisement/${job[0]}`} style={{marginLeft: 30}}>
							View Advertisement
					</Link>
				</CardActions>
			</Card>
		))
	}

	return loading ? (
		<div></div>
	) : (
		<Grid>      
			<Row noGutters fluid><TitleBar name={window.localStorage.getItem("name")}/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 60}}>
				<Col sm={2}>
					<SideMenu random={[
						{'text':'Job Seeker Dashboard','href': '#', 'active': true},
						{'text':'Your Applications','href': '#', 'active': false},
						{'text':'Your Offers','href': '/offers', 'active': false},         
						{'text':'FAQ','href':'/jobseekerFAQ','active': false}]}/>
				</Col >
				<Col>
					<Typography variant="h4" style={{color: 'black', textAlign: "center",margin:20 }}>
						Job Search
					</Typography>
					<Form onSubmit={handleSubmit}>
						<Col xs={12} style={{display: 'flex',flexWrap: 'wrap',justifyContent: "center"}}>
							<TextField size="small"
								onChange={ (event) => setSearchString(event.target.value)}
								style={{ margin: 8 }}
								placeholder="Job Title, Company,Skills"
								margin="normal"
								InputLabelProps={{shrink: true,}}
								variant="outlined"/>
							<TextField size="small"
								onChange={ (event) => setLocation(event.target.value)}
								style={{ margin: 8 }}
								placeholder="Location"
								margin="normal"
								InputLabelProps={{shrink: true,}}
								variant="outlined"/>
							<Button type="submit" variant="contained" style={{margin:10}}>
								Search
							</Button>
						</Col>

						<Col xs={12} style={{display: 'flex',flexWrap: 'wrap',justifyContent: "center"}}>
							<Link href="#" onClick={handleToggleFilters} aria-controls="filter-collapse" aria-expanded={open}>
								Advanced Filters
							</Link>
						</Col>

						<Collapse in={open}>
							<div id="filter-collapse">
								<Col xs={12} style={{display: 'flex',flexWrap: 'wrap',justifyContent: "center"}}>
									<FormControl variant="outlined" style={{ margin: 8 , flexBasis:'10%'}}>
										<InputLabel>Job-type</InputLabel>
										<Select autoWidth={true} value={jobType} onChange={e=> setJobType(e.target.value)} label="Job-type">
											<MenuItem value=""><em>n/a</em></MenuItem>
											<MenuItem value='Part-time'>Part-time</MenuItem>
											<MenuItem value='Full-time'>Full-time</MenuItem>
											<MenuItem value='Casual/Vacation'>Casual/Vacation</MenuItem>
											<MenuItem value='Temp/Contract'>Temp/Contract</MenuItem>
										</Select>
									</FormControl>

									<FormControl variant="outlined" style={{ margin: 8, flexBasis:'20%' }}>
										<InputLabel>Experience Level</InputLabel>
										<Select value={experienceLevel} onChange={e=> setExperienceLevel(e.target.value)} label="experienceLevel">
											<MenuItem value=""><em>n/a</em></MenuItem>
											<MenuItem value='Internship'>Internship</MenuItem>
											<MenuItem value='Entry level'>Entry level</MenuItem>
											<MenuItem value='Associate'>Associate</MenuItem>
											<MenuItem value='Mid-Senior level'>Mid-Senior level</MenuItem>
											<MenuItem value='Director'>Director</MenuItem>
											<MenuItem value='Executive'>Executive</MenuItem>
										</Select>
									</FormControl>
						
				
									<FormControl variant="outlined" style={{ margin: 8, flexBasis:'50%' }}>
										<Typography id="range-slider" gutterBottom>
											Salary Range (p.a)
										</Typography>
										<Slider
											value={salaryRange}
											marks={marks}
											max='200'
											step='10'
											onChange={handleSliderChange}
											valueLabelDisplay="auto"
											aria-labelledby="range-slider"/>
									</FormControl>
								</Col>
							</div>
						</Collapse>
					</Form>
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						All Jobs
					</Typography>
					<div className="card-deck"  style={{ display: 'flex', flexWrap: 'wrap',justifyContent: 'normal', paddingLeft:'5%'}}>
						{renderJobs()}
					</div>
				</Col>
			</Row>
		</Grid>
	);
}