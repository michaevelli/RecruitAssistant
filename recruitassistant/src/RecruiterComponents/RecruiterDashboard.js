import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { TextField, Button, Grid,Card,CardContent,CardActions } from "@material-ui/core";
import { button,Container,Col,Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";


export default function RecruiterDashboard() {
    
    return(
        <Grid fluid={true}>

            <Container fluid>
            <TitleBar/>
            </Container>

            <Container fluid={true}  >

                <Row noGutters  >
                    <Col sm={2}  >
                    <SideMenu random={['Recruiter Dashboard']}/>
                    </Col >
                    <Col sm={8}>
                    <div className="card-deck"  style={{ display: 'flex', flexWrap: 'wrap',justifyContent: 'left'}}>
                  
                        <Card style={{margin: 30, height: 150, width:200}}>
                            <CardContent>                          
                                <Typography variant="h5" component="h2">
                                    Job title
                                </Typography>
                                <Typography color="textSecondary">
                                    Company | City
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">View details</Button>
                            </CardActions>
                    </Card>
                
                   
                    <Card style={{margin: 30, height: 150, width:200}}>
                        <CardContent>                          
                            <Typography variant="h5" component="h2">
                                Job title
                            </Typography>
                            <Typography color="textSecondary">
                                Company | City
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">View details</Button>
                        </CardActions>
                    </Card>
                    </div>
                    </Col>
                    

                    <Col>
                    <button className='btn btn-danger pull-right' style={{margin: 10}}>
                        New Job
                        </button>                 
                    </Col>
            </Row>
            
            </Container>

          </Grid>
       );
}