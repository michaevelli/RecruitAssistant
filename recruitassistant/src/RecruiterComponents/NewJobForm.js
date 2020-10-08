import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link,Slider, Grid,Card,CardContent,Button,CardActions ,TextField,FormControl,InputLabel,MenuItem,Select} from "@material-ui/core";
import {Form,Container,Col,Row,Collapse} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";

export const jobUrl="http://localhost:5000/jobAdverts/"

export default function NewJobForm() {
    
    
    //error msg or successful job creation
    const [response,setResponse]=useState('')
	const [title,setTitle] = useState('');
	const [company,setCompany] = useState('');
	const [description,setDescription] = useState('');
	const [minYearsExp,setMinYearsExp] = useState('');
    const [location,setLocation] = useState('');
    const [jobType,setJobType] = useState('');
    const [experienceLevel,setExperienceLevel] = useState('');
    //salary range units are in k/$1000
	const [salaryRange,setSalaryRange] = useState([0,10]);
	const [closingDate,setClosingDate] = useState('');
	const [skills,setSkills] = useState('');
	const [requiredDoc,setRequiredDoc] = useState('');
    
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

				<Col sm="9">
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						Create New Job
					</Typography>
                    <Form onSubmit={handleSubmit}>
                       
                        <Form.Group controlId="title">
							<Form.Label column sm={2}>
							Title
							</Form.Label>
							<Col sm={10}>
								<Form.Control placeholder="Title"
									onChange={ (event) => {console.log(event.target.value)
									setTitle(event.target.value)
								}} />
							</Col>
						</Form.Group>
						<Form.Group controlId="company">
							<Form.Label column sm={2}>
							Company
							</Form.Label>
							<Col sm={10}>
								<Form.Control placeholder="Company" />
							</Col>
						</Form.Group>

						<Form.Group controlId="location">
							<Form.Label column sm={2}>
							Location
							</Form.Label>
							<Col sm={10}>
								<Form.Control placeholder="Location" />
							</Col>
						</Form.Group>

						<Form.Group controlId="description">
							<Form.Label column sm={2}>
							Description</Form.Label>
							<Col sm={10}>
							<Form.Control as="textarea" rows="3" />
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


						<fieldset>
							<Form.Group as={Row}>
							<Form.Label as="legend" column sm={2}>
								Qualifications
							</Form.Label>
							<Col sm={10}>
							
							<Link style={{marginLeft: 30}} >
							+ Add Qualification
							</Link>

							</Col>
							</Form.Group>
						</fieldset>


						
				
                    </Form>  
				</Col>
					
			
			</Row>
		</Grid>
	);
}