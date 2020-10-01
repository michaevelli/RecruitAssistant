import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { TextField, Button, Grid } from "@material-ui/core";
import {Card, Container,Col,Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

export default function TitleBar() {
    
    return(
      
        <nav className="navbar navbar-dark fixed-top flex-md-nowrap p-0 shadow"
        style={{"backgroundColor": '#348360'}}>
            <a className="navbar-brand col-sm-3" href="#">RecruitAssistant</a>
            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap">
                <a className="nav-link" href="#">Log out</a>
                </li>
            </ul>
        </nav>
    );
}