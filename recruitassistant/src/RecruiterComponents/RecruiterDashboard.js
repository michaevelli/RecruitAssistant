import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link, Button, Grid,Card,CardContent,CardActions } from "@material-ui/core";
import {Container,Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import Async from 'react-async';
import { getJobs } from '../services/JobAdvertServices';


export default function RecruiterDashboard() {

    return(
        <Grid >         
            <Row noGutters fluid>           
                <TitleBar/>       
            </Row>
           

            <Row noGutters style={{
                    height:'100vh',
                    paddingTop: 40
                    }}>

                    <Col sm="2" >
                    <SideMenu random={[ {'text':'Recruiter Dashboard',
                                            'href': '#','active': true},
                                            
                                            {'text':'FAQ',
                                            'href':'#','active': false}
                                        ]}/>
                    </Col >

                    <Col sm="9">
                    <Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
                    Your Jobs
                    </Typography>

                    <Async promiseFn={getJobs}>
                    <Async.Loading>Loading.... </Async.Loading>
                    <Async.Fulfilled>
                    {data=> {
                        return(
                        <div className="card-deck"  style={{ display: 'flex', flexWrap: 'wrap',justifyContent: 'normal', paddingLeft:'5%'}}>
                  
                        {data.jobs.map((job) => 
                        
                        (<Card style={{margin: 30, height: 150, width:250}}>
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
                        </Card>))
                        }</div>)}
                    }
                            


                    </Async.Fulfilled>
                    <Async.Rejected> Something went wrong..</Async.Rejected>
                    </Async>   
                    </Col>
                    

                    <Col>
                    <Button variant="contained" color="secondary" href="/newJob" style={{position: 'fixed', right: 0, top: 20, margin: 30}}>
                        + Job
                    </Button>               
                    </Col>
            </Row>
          </Grid>
       );
}