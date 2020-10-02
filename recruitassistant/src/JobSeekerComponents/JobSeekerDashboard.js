import React, { useState } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link, Button, Grid,Card,CardContent,CardActions ,TextField,FormControl,InputLabel,MenuItem,Select} from "@material-ui/core";
import {Container,Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";


export default function JobSeekerDashboard() {
    const handleSubmit= async (event) =>{
        event.preventDefault();
        const data={
            
        };
       
    }

    const handleChange= async (event) =>{
        event.preventDefault();
        const data={
            
        };
       
    }
    return(
        <Grid 
        container
        direction="row"
        justify="space-around"
        alignItems="flex-start"
      >

            <Container fluid={true}>           
                <TitleBar/>
            </Container>

            <Container fluid={true}>

                <Row noGutters  
                    style={{
                    height:'100vh',
                    overflow: 'auto',
                    paddingTop: 40}}>

                    <Col sm={2}  >
                    <SideMenu random={['JobSeeker Dashboard','Your Applications','FAQ']}/>
                    </Col >
                    <Col>
                    <form onSubmit={handleSubmit}>
                            <div 
                             style={{ 
                             display: 'flex', 
                             flexWrap: 'wrap',
                             justifyContent: "center"}}>
                        
                            <TextField
                            id="outlined-full-width"
                            style={{ margin: 8 }}
                            placeholder="Job Title, Company,Skills"
                            margin="normal"
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                            />
                             <TextField
                            id="outlined-full-width"
                            style={{ margin: 8 }}
                            placeholder="Location"
                            margin="normal"
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                            />


                        <FormControl variant="outlined" style={{ margin: 8 }}>
    
                        <InputLabel id="demo-simple-select-outlined-label">Job-type</InputLabel>
                        <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value="lala"
                        onChange={handleChange}
                        label="Age"
                        >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value='Part-time'>Part-time</MenuItem>
                        <MenuItem value='Full-time'>Full-time</MenuItem>
                        <MenuItem value='Casual'>Casual</MenuItem>
                        </Select>
                        </FormControl>
                        </div>
                        </form>        

                    </Col>
                    
            </Row>
            
            </Container>

          </Grid>
       );
}