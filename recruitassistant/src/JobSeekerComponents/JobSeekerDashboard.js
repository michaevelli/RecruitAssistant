import React, { useState } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link, Button, Grid,Card,CardContent,CardActions ,TextField,FormControl,InputLabel,MenuItem,Select} from "@material-ui/core";
import {Form,Container,Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";


export default function JobSeekerDashboard() {

    const [searchString,setSearchString] = useState('');
    const [location,setLocation] = useState('');
    const [jobType,setJobType] = useState('');
    const [experienceLevel,setExperienceLevel] = useState('');
    const [salary,setSalary] = useState('');

    const handleSubmit= async (event) =>{
        event.preventDefault();
        //TODO
        const data={
            
        };
       
    }

    const handleChange= async (event) =>{
        event.preventDefault();
        //TODO
       
    }
    return(
        <Grid >
          
        <Row noGutters fluid>           
            <TitleBar/>       
        </Row>
       

        <Row noGutters style={{
                height:'100vh',
                paddingTop: 40
                }}>

              
            <Col sm={2}  >
                <SideMenu random={['JobSeeker Dashboard','Your Applications','FAQ']}/>
            </Col >
            
            <Col>
                <Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
                    Job Search
                </Typography>

                <Form onSubmit={handleSubmit}>                 
                <Col xs={12} style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap',
                        justifyContent: "center"}} >
                    <TextField
                         onChange={ (event) => setSearchString(event.target.value)}
                        style={{ margin: 8 }}
                        placeholder="Job Title, Company,Skills"
                        margin="normal"
                        InputLabelProps={{
                        shrink: true,
                        }}
                        variant="outlined"
                        />
                    <TextField 
                        onChange={ (event) => setLocation(event.target.value)}
                        style={{ margin: 8 }}
                        placeholder="Location"
                        margin="normal"
                        InputLabelProps={{
                        shrink: true,
                        }}
                        variant="outlined"
                        />
                    <Button type="submit" variant="contained" style={{margin:10}}>
                        Search
                    </Button>            
                 </Col>



                 <Col xs={12} style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap',
                        justifyContent: "center"}}>
                <FormControl variant="outlined" style={{ margin: 8 , flexBasis:'10%'}}>

                <InputLabel >Job-type</InputLabel>
                    <Select
                        value={jobType}
                        onChange={ (event) => setJobType(event.target.value)}
                        label="Job-type"
                        inputProps={{
                            name: 'jobType',
                            id: 'jobType'
                          }}
                    >
                    <MenuItem value="">
                        <em>n/a</em>
                    </MenuItem>
                    <MenuItem value='Part-time'>Part-time</MenuItem>
                    <MenuItem value='Full-time'>Full-time</MenuItem>
                    <MenuItem value='Casual/Vacation'>Casual/Vacation</MenuItem>
                    <MenuItem value='Temp/Contract'>Temp/Contract</MenuItem>
                </Select>
                </FormControl>

                <FormControl variant="outlined" style={{ margin: 8, flexBasis:'20%' }}>
                <InputLabel>Experience Level</InputLabel>
                  <Select                       
                        value={experienceLevel}
                        onChange={ (event) => setExperienceLevel(event.target.value)}
                        label="experienceLevel"
                        inputProps={{
                            name: 'experienceLevel',
                            id: 'experienceLevel',
                          }}
                    >
                    <MenuItem value="">
                        <em>n/a</em>
                    </MenuItem>
                    <MenuItem value='Internship'>Internship</MenuItem>
                    <MenuItem value='Entry level'>Entry level</MenuItem>
                    <MenuItem value='Assosciate'>Assosciate</MenuItem>
                    <MenuItem value='Mid-Senior level'>Mid-Senior level</MenuItem>
                    <MenuItem value='Director'>Director</MenuItem>
                    <MenuItem value='Executive'>Executive</MenuItem>
                </Select>
                </FormControl>
                  
                <FormControl variant="outlined" style={{ margin: 8, flexBasis:'15%' }}>
                <InputLabel>Salary p.a</InputLabel>
                <Select
                    value={salary}
                    onChange={ (event) => setSalary(event.target.value)}
                    label="Salary"
                    inputProps={{
                        name: 'salary',
                        id: 'salary'
                      }}
                >
                <MenuItem value="">
                    <em>n/a</em>
                </MenuItem>
                <MenuItem value='0'>0k</MenuItem>
                <MenuItem value='10'>10k+</MenuItem>
                <MenuItem value='20'>20k+</MenuItem>
                <MenuItem value='30'>30k+</MenuItem>
                <MenuItem value='40'>40k+</MenuItem>
                <MenuItem value='50'>50k+</MenuItem>
                <MenuItem value='60'>60k+</MenuItem>
                <MenuItem value='70'>70k+</MenuItem>
                <MenuItem value='80'>80k+</MenuItem>
                <MenuItem value='100'>100k+</MenuItem>
                <MenuItem value='120'>120k+</MenuItem>
                <MenuItem value='150'>150k+</MenuItem>
                </Select>
                </FormControl>

                </Col>
                
                </Form>        
               
            </Col>
            
        </Row>
        
      
        </Grid>
       );
}