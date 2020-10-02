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
                    <form onSubmit={handleSubmit}>
                        <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap',
                            justifyContent: "center"}}>
                    
                        <TextField
                            style={{ margin: 8 }}
                            placeholder="Job Title, Company,Skills"
                            margin="normal"
                            InputLabelProps={{
                            shrink: true,
                            }}
                            variant="outlined"
                            />
                            <TextField style={{ margin: 8 }}
                                placeholder="Location"
                                margin="normal"
                                InputLabelProps={{
                                shrink: true,
                                }}
                                variant="outlined"
                             />


                    <FormControl variant="outlined" style={{ margin: 8 }}>

                    <InputLabel>Job-type</InputLabel>
                    <Select
                        value="job type"
                        onChange={handleChange}
                        label="Job-type"
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
        
      
        </Grid>
       );
}