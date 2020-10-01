import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { TextField, Button, Grid } from "@material-ui/core";
import {Card, Container,Col,Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import TitleBar from "./TitleBar.js";
import SideMenu from "./SideMenu.js";


export default function DashBoardTemplate() {
    
    return(
        <Grid fluid={true}>

            <Container fluid>
            <TitleBar/>
            </Container>

            <Container fluid={true}  >
                <Row noGutters >
                    <Col sm={2}  >
                    <SideMenu random={['link1','link2','link3']}/>
                    </Col>

                    <Col>CONTENT</Col>

            </Row>
            </Container>
          </Grid>
       );
}