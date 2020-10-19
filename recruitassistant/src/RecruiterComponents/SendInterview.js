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
    const postInterview = async () => {
				// data will be given as a list of json objects i.e. [{"employer_id": 4321, "jobseeker_id": 1234, "job_id": 2121212,"date": date},{...}]
				// sample data here
        // will replace with data given by application list
        console.log(this.state.items)
        const data={
						invite_list: [
							{
								"jobseeker_id": "SErnvdU3Habmmbs0iKU8yCP2N6A2", 
								"employer_id": sessionStorage.getItem("uid"), 
								"job_id": "d12a3a2b-09e3-11eb-a227-34f39a2d0b77", 
								"date": "2020-10-20"
							},
							{
								"jobseeker_id": "eXENTD6TTQV0M0reXynlYMWqpjE3", 
								"employer_id": sessionStorage.getItem("uid"), 
								"job_id": "8200ca45-0e01-11eb-84cf-34f39a2d0b77", 
								"date": "2020-10-20"
							}
					]
				}

				console.log(data)
				await axios.post(interviewUrl, data)
				.then(res => {
					console.log("response: ", res)
					alert("Interview Successfully Sent")
				})
				.catch((error) => {
					console.log("error: ", error.response)
					alert("An error occured, please try again")
				})	
    };
    
    return(
        <Button 
					onClick={() => {postInterview()}}
					variant="contained"
					style={{"margin":5}}>
					Send Invites
				</Button>

    );

}