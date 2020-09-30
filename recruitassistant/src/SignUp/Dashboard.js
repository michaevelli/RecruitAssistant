import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { TextField, Button, Grid } from "@material-ui/core";
import {Card, Container,Col,Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

export default function DashBoardTemplate() {
    
    return(
        <Grid fluid={true}>
        
        <Container fluid>
        <nav className="navbar navbar-dark fixed-top flex-md-nowrap p-0 shadow"
        style={{"background-color": '#348360'}}>
            <a className="navbar-brand col-sm-3" href="#">RecruitAssistant</a>
            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap">
                <a className="nav-link" href="#">Log out</a>
                </li>
            </ul>
        </nav>
        </Container>

        <Container fluid={true}  >
            <Row noGutters >
                <Col sm={2} style={{'height': '100vh','backgroundColor': "#DEDEDE" }}>
                <nav class="navbar " style={{'position':'fixed'}}>
                <ul class="navbar-nav" >
                <li class="nav-item">
                    <a class="nav-link active" href="#">Active</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link disabled" href="#">Disabled</a>
                </li>
                </ul> 
                </nav>
                </Col>
            
                <Col>CONTENT</Col>

          </Row>
          </Container>


          </Grid>


       );
}