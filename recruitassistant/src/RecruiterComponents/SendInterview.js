import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {IconButton,Grid,Button,TextField} from "@material-ui/core";
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import {Form,Container,InputGroup,Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const interviewUrl="http://localhost:5000/interviews"

export default function SendInterview() {
    const history = useHistory();

    useEffect(() => {
		auth();
    });
    
    const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				// const recruiterID = sessionStorage.getItem("uid")			
				if (!response.success || response.userInfo["type"] != "recruiter") {
					history.push("/unauthorised");
				}
			})
    }
    
    const postInterview = async () => {
        const data={
            
		}
		console.log(data)
		await axios.post(interviewUrl, data)
			.then(res => {
				console.log("response: ", res)
				alert("Interview Successfully Sent")
				history.push("/recruiterdashboard")
			})
			.catch((error) => {
				console.log("error: ", error.response)
				alert("An error occured, please try again")
			})	
	};

}