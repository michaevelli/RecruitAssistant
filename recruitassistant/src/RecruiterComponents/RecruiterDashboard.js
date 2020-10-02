import React, { useState } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link, Button, Grid,Card,CardContent,CardActions } from "@material-ui/core";
import {Container,Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";


export default function RecruiterDashboard() {
    
    return(
        <Grid fluid={true}>

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
                    <SideMenu random={['Recruiter Dashboard','FAQ']}/>
                    </Col >
                    <Col sm={9}>
                    <div className="card-deck"  style={{ display: 'flex', flexWrap: 'wrap',justifyContent: 'left'}}>
                  
                        <Card style={{margin: 30, height: 150, width:250}}>
                            <CardContent>                          
                                <Typography variant="h5" component="h2">
                                    Job title
                                </Typography>
                                <Typography color="textSecondary">
                                    Company | City
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Typography color="textSecondary">
                                    status
                                </Typography>
                                <Link href="#" style={{marginLeft: 30}} >
                                        View applications
                                </Link>
                            </CardActions>
                    </Card>

                    <Card style={{margin: 30, height: 150, width:250}}>
                            <CardContent>                          
                                <Typography variant="h5" component="h2">
                                    Job title
                                </Typography>
                                <Typography color="textSecondary">
                                    Company | City
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Typography color="textSecondary">
                                    status
                                </Typography>
                                <Link href="#" style={{marginLeft: 30}} >
                                        View applications
                                </Link>
                            </CardActions>
                    </Card>
                
                   
                    <Card style={{margin: 30, height: 150, width:250}}>
                        <CardContent>                          
                            <Typography variant="h5" component="h2">
                                Job title
                            </Typography>
                            <Typography color="textSecondary">
                                Company | City
                            </Typography>
                            
                        </CardContent>
                        <CardActions>
                            
                            <Typography color="textSecondary">
                                    status
                            </Typography>
                            <Link href="#" style={{marginLeft: 30}} >
                                        View applications
                                </Link>
                        </CardActions>
                    </Card>

               
                    <Card variant="outlined" style={{margin: 30, height: 150, width:250, borderColor: 'black' }}>
                            <CardContent>                          
                                <Typography variant="h5" component="h2">
                                    Alternate card style
                                </Typography>
                                <Typography color="textSecondary">
                                    Company | City
                                </Typography>
                            </CardContent>
                            <CardActions >
                                <Typography color="textSecondary" >
                                    status
                                </Typography>
                                <Link href="#" style={{marginLeft: 30}} >
                                        View applications
                                </Link>
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