import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link,Slider, Grid,Card,CardContent,Button,CardActions ,TextField,FormControl,InputLabel,MenuItem,Select} from "@material-ui/core";
import {Form,Container,Col,Row,Collapse} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";
import axios from "axios";

export default function UserList() {
    const history = useHistory();
    const [loading, setLoading] = useState(true);

    const columns = [
		{ field: 'ID', headerName: 'ID', width: 400 },
		{ field: 'first_name', headerName: 'First Name', width: 200 },
        { field: 'last_name', headerName: 'Last Name', width: 200 },
        { field: 'email', headerName: 'email', width: 200 },
        { field: 'type', headerName: 'type', width: 200}
    ];
    
    const deleteUserUrl = "http://localhost:5000/admin-delete-user"
    const getUserUrl = "http://localhost:5000/admin-get-users"
    
    useEffect(() => {
        auth();
        getUsers();
    }, []);
    
    const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				setLoading(false)				
				if (!response.success || response.userInfo["type"] != "admin") {
					history.push("/unauthorised");
				}
			})
    }
    
    const getUsers = async() => {
        await axios.post(getUserUrl)
        .then(res=> {
            console.log(res)
        })
        .catch((error) => {
            console.log(error)
        })

    }


    const deleteUser = async(user_id) => {
		const data={
			uid: user_id
		}
		
		await axios.post(deleteUserUrl, data)
		.then(res => {
			console.log(res)
		})
		.catch((error) => {
			console.log(error)
		})
    }
    
    return(
        <Grid>
            <Row noGutters fluid><TitleBar name={window.localStorage.getItem("name")}/></Row>
            <Row noGutters style={{height:'100vh',paddingTop: 60}}>
                <Col sm={2}>
                    <SideMenu random={[
                        {'text':'Jobs','href': '#', 'active': true},
                        {'text':'Users','href': '#', 'active': false}]}/>
                </Col >
            </Row>
        </Grid>
    );
}