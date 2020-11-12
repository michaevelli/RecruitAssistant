import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link,Slider, Button,Grid,TextField,FormControl,InputLabel,MenuItem,Select} from "@material-ui/core";
// Card,CardContent,Button,CardActions
import CircularProgress from '@material-ui/core/CircularProgress';
import {Form,Container,Col,Row,Collapse, Card} from 'react-bootstrap';
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
	const [publicUser, setPublicUser] = useState(true);
	const [loading, setLoading] = useState(true);
	const [loadingJobs, setLoadingJobs] = useState(true);
	const [searchString,setSearchString] = useState('');
	const [location,setLocation] = useState('');
	const [jobType,setJobType] = useState('');
	const [jobStatus,setJobStatus] = useState('open');
	const [experienceLevel,setExperienceLevel] = useState('');
	//salary range units are in k/$1000
	const [salaryRange,setSalaryRange] = useState([0,200]);
	//open is used to toggle advanced filters div
	const [open, setOpen]=useState(false)
	const [jobs, setJobs]=useState([])
	const [openJobs, setOpenJobs]=useState([])
	const [closedJobs, setClosedJobs]=useState([])

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
				if (response.success && response.userInfo["type"] === "jobseeker") {
					setPublicUser(false)
				}
			})
	}

	const sortJobs = (allJobs) => {
		setJobs(allJobs)
		const tempOpen = []
		const tempClosed = []
		for (var i = 0; i < allJobs.length; i++) {
			if (allJobs[i][1].status === "open") {
				tempOpen.push(allJobs[i])
			} else {
				tempClosed.push(allJobs[i])
			}
		}
		setOpenJobs(tempOpen)
		setClosedJobs(tempClosed)
	}

	const getJobs = async () => {
		const url = `${jobUrl}open`
		console.log(url)
		await axios.get(url)
			.then(res => {
				sortJobs(res.data.jobs)
				setLoadingJobs(false)
				console.log("response: ", res)
			})
			.catch((error) => {
				console.log("error: ", error.response)
			})
	};
	const clearSearch = async () =>{
		setLoadingJobs(true)
		setSearchString('');
		setLocation('');
		setJobType('');
		setExperienceLevel('');
		//salary range units are in k/$1000
		setSalaryRange([0,200]);
		const url = `${jobUrl}search`
		const ndata={
			search: '',
			location: '',
			exp: '',
			jobtype: '',
			salaryrange: [0,200]		
		};
		console.log(ndata)
		axios.post(url, ndata)
			.then(function(response) {
				sortJobs(response.data.jobs)
				setLoadingJobs(false)
				console.log(response)
			})
			.catch(function(error) {
				console.log(error.response)
			})
	}
	const handleSubmit= async (event) =>{
			event.preventDefault();
			setLoadingJobs(true)
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
					sortJobs(response.data.jobs)
					setLoadingJobs(false)
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

	function truncateText(text) {
		if (text.length > 180) {
			return text.slice(0, 180) + "..."
		}
		return text
	}

	const renderJobs = () => {
		var selectedJobs = []
		if (jobStatus === "open") {
			selectedJobs = openJobs
		} else if (jobStatus === "closed") {
			selectedJobs = closedJobs
		} else {
			selectedJobs = jobs
		}
		return selectedJobs.length===0? (
			<div style={{display:'flex',justifyContent:'center',marginTop:100}}>No results. Try another search?</div>
			) : (selectedJobs.map((job) => (
			<div><div style={{display: 'flex', justifyContent: 'center'}}>
				<Card style={ job[1].status=='open'? 
					{width:"80%", height:"200px"} : 
					{backgroundColor:'lightgrey', opacity:"0.5", width:"80%", height:"200px"}} >
					<Card.Body>
						<Row>
							<Col>
								<Card.Title><Link href={"/advertisement/"+job[0]}>{job[1].title}</Link></Card.Title>
								<Card.Text style={{fontStyle: 'italic'}}>{job[1].company} | {job[1].location} | {job[1].job_type}</Card.Text>
								<Card.Text>{truncateText(job[1].description)}</Card.Text>
							</Col>
							<Col xs={4}>
								<div style={{textAlign:'right'}}>
									{job[1].status == "open" ? 
											<Card.Text>Closing date: {job[1].closing_date}</Card.Text> :
											<Card.Text>This job is closed</Card.Text>
									}
								</div>
							</Col>
						</Row>
					</Card.Body>
				</Card>
			</div><br/></div>
		)))
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
					{!publicUser ? (
						<SideMenu random={[
							{'text':'Job Seeker Dashboard','href': '#', 'active': true},
							{'text':'Your Applications','href': '/yourapplications', 'active': false},       
							{'text':'FAQ','href':'/jobseekerFAQ','active': false}]}/>
					) : (
						<SideMenu random={[
							{'text':'Home','href': '/', 'active': false},
							{'text':'Browse Jobs','href': '#', 'active': true}]}/>
					)}
					
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
								placeholder="Job Title, Company, Skills"
								margin="normal"
								value={searchString}
								InputLabelProps={{shrink: true,}}
								variant="outlined"/>
							<TextField size="small"
								onChange={ (event) => setLocation(event.target.value)}
								style={{ margin: 8 }}
								placeholder="Location"
								value={location}
								margin="normal"
								InputLabelProps={{shrink: true,}}
								variant="outlined"/>
							<Button  type="submit" variant="contained" color="primary" style={{margin:10, maxHeight: '40px'}}>
								Search
							</Button>
							<Button size="small"  onClick={()=>clearSearch()} variant="contained" style={{margin:10, maxHeight: '40px'}}>
								Clear
							</Button>
						</Col>

						<Col xs={12} style={{display: 'flex',flexWrap: 'wrap',justifyContent: "center"}}>
							<Link href="#" onClick={handleToggleFilters} aria-controls="filter-collapse" aria-expanded={open}>
								Advanced Criteria
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

									<FormControl variant="outlined" style={{ margin: 8 , flexBasis:'10%'}}>
										<InputLabel>Status</InputLabel>
										<Select autoWidth={true} value={jobStatus} onChange={e=> setJobStatus(e.target.value)} label="Status">
											<MenuItem value='open'>Open</MenuItem>
											<MenuItem value='closed'>Closed</MenuItem>
											<MenuItem value='open and closed'>All jobs</MenuItem>
										</Select>
									</FormControl>
								</Col>
								<Col xs={12} style={{display: 'flex',flexWrap: 'wrap',justifyContent: "center"}}>
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
					{/* <Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						All Jobs
					</Typography> */}
					<br/><br/>
					<Container>
						{loadingJobs && 
							<div style={{
								position: 'absolute', left: '50%', top: '70%',
								transform: 'translate(-50%, -50%)'
								}}>
								<CircularProgress/>
							</div>
						}
						{!loadingJobs && renderJobs()}
					</Container>
					{/* <div className="card-deck"  style={{ display: 'flex', flexWrap: 'wrap',justifyContent: 'normal', paddingLeft:'5%'}}>
						{renderJobs()}
					</div> */}
				</Col>
			</Row>
		</Grid>
	);
}