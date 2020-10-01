import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { TextField, Button, Grid } from "@material-ui/core";
import {Card, Container,Col,Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

export default function SideMenu(data) {
    
    return(
        <div style={{'height': '100vh','backgroundColor': "#DEDEDE" }}>
                <nav class="navbar " style={{'position':'fixed'}}>
                <ul class="navbar-nav" >
               
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
                </div>

    );
}