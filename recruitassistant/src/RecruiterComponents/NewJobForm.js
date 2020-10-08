import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';

import {Link, Input,InputAdornment, Grid,Button,FormControl,InputLabel,TextField} from "@material-ui/core";
import {Form,Container,InputGroup,Col,Row,Collapse} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";


export const jobUrl="http://localhost:5000/jobAdverts/"

export default function NewJobForm() {
	
	//for date picker (closing date)
	//More info: https://material-ui.com/components/pickers/
    const [selectedDate, setSelectedDate] = useState(new Date('2014-08-18T21:11:54'));
	const handleDateChange = (date) => {
		setSelectedDate(date);
	};


    //error msg or successful job creation
    const [response,setResponse]=useState('')
	const [title,setTitle] = useState('');
	const [company,setCompany] = useState('');
	const [description,setDescription] = useState('');
	const [minYearsExp,setMinYearsExp] = useState('');
    const [location,setLocation] = useState('');
    const [jobType,setJobType] = useState('');
    const [experienceLevel,setExperienceLevel] = useState('');
    //salary units in units k/$1000
	const [salary,setSalary] = useState(100);
	const [closingDate,setClosingDate] = useState('');
	const [skills,setSkills] = useState(['python','c++']);
	const [requiredDoc,setRequiredDoc] = useState([]);
	
	const addSkill= () =>{
		setSkills(prevSkills => [...prevSkills, ''])
	}
	

    //tTODO
	const postJob = async () => {
        const url = jobUrl
        const data=''
		await axios.post(url)
			.then(res => {
				setResponse(res.data)
				console.log("response: ", res)
			})
			.catch((error) => {
				console.log("error: ", error.response)
			})
    };
    const handleSubmit= async (event) =>{
        event.preventDefault();
		// postJob()
        
    };

	return (
		<Grid>
			<Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 40}}>
				<Col sm="2">
					<SideMenu random={[
						{'text':'Recruiter Dashboard','href': '#','active': true},
						{'text':'FAQ','href':'#','active': false}]}/>
				</Col>

				<Col sm="10" >
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						Create New Job
					</Typography>
                    <Form onSubmit={handleSubmit} style={{marginLeft:'15%'}}>
                       
                        <Form.Group controlId="title">
							<Form.Label column sm={2}>
							Title
							</Form.Label>
							<Col sm={10}>
								<Form.Control placeholder="Title"
									onChange={ (event) => setTitle(event.target.value)} />
							</Col>
						</Form.Group>
						<Form.Group controlId="company">
							<Form.Label column sm={2}>
							Company
							</Form.Label>
							<Col sm={10}>
								<Form.Control placeholder="Company"
								onChange={ (event) => setCompany(event.target.value)}/>
							</Col>
						</Form.Group>

						<Form.Group controlId="location">
							<Form.Label column sm={2}>
							Location
							</Form.Label>
							<Col sm={10}>
								<Form.Control placeholder="Location"
								onChange={ (event) => setLocation(event.target.value)}/>
							</Col>
						</Form.Group>

						<Form.Group controlId="description">
							<Form.Label column sm={2}>
							Description</Form.Label>
							<Col sm={10}>
								<Form.Control as="textarea" rows="3" 
								onChange={ (event) => setDescription(event.target.value)}/>
							</Col>
						</Form.Group>

						<Form.Group controlId="jobType">
						<Form.Label column sm={2}>
							Job type</Form.Label>
							<Col sm={10}>
								<Form.Control as="select" 
								onChange={e=>setJobType(e.target.value)} 
								defaultValue="Choose...">
									<option>Part-time</option>
									<option>Full-time</option>
									<option>Casual/Vacation</option>
									<option>Temp/Contract</option>								
								</Form.Control>
							</Col>	
						</Form.Group>

						<Form.Group controlId="experienceLevel">
						<Form.Label column sm={2}>
							Experience Level</Form.Label>
							<Col sm={10}>
								<Form.Control as="select" 
								onChange={e=>setExperienceLevel(e.target.value)} 
								defaultValue="Choose...">
									<option>Internship</option>
									<option>Entry level</option>
									<option>Associate</option>
									<option>Mid-Senior level</option>	
									<option>Director</option>	
									<option>Executive</option>								
								</Form.Control>
							</Col>	
						</Form.Group>

						<Form.Group controlId="salary">
							<Form.Label column sm={2}>
							Salary (p.a)
							</Form.Label>
							
							<Col sm={10}>
								<InputGroup>
									<InputGroup.Prepend>
										<InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
									</InputGroup.Prepend>
									<Form.Control placeholder=""
									onChange={ (event) => setSalary(event.target.value)}/>
									<Form.Text className="text-muted">
									Please enter salary in units of K/$1000
									</Form.Text>
								</InputGroup>
							</Col>
						</Form.Group>

						
						<Form.Group controlId="closingDate">
							<Form.Label column sm={2}>
							Closing Date</Form.Label>
							<Col sm={10}>
								<TextField
									id="closingDate"
									type="date"
									onChange={ (event) => setClosingDate(event.target.value)}
								/>
							</Col>
						</Form.Group>
							
						<fieldset>
						<Form.Group controlId="skills">
							<Form.Label as="legend" column sm={2}>
							Qualifications
							</Form.Label>
							<Button style={{marginLeft: 30}} onClick={ addSkill
							}>
								+ Add Qualification
							</Button>
							<Col sm={10}>
							{
								skills.map( (s,indx) =>(
								<Form.Group controlId="skill">
									<Col sm={10}>
										<Form.Control placeholder={s}/>
									</Col>
								</Form.Group>
								))
							}
								

							</Col>
						</Form.Group>
						</fieldset>

						<fieldset>
						<Form.Group controlId="requiredDocs">
							<Form.Label as="legend" column sm={2}>
							Required Documents
							</Form.Label>
							<Col sm={10}>
								
								<Link style={{marginLeft: 30}} >
								+ Add Document type
								</Link>

							</Col>
						</Form.Group>
						</fieldset>

						<Button variant="contained" color="primary" type="submit" style={{margin: 20}}>
						Create New Job
						</Button>    

						
				
                    </Form>  
				</Col>
					
			
			</Row>
		</Grid>
	);
}