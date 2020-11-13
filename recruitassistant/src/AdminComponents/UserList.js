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
import { DataGrid, CellParams, } from '@material-ui/data-grid';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';


export default function UserList() {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    const columns = [
		{ field: 'first_name', headerName: 'First Name', width: 200 },
        { field: 'last_name', headerName: 'Last Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 300 },
        { field: 'type', headerName: 'Type', width: 100},
        {field: 'delete', headerName: 'Delete', width:100,
        renderCell: (params) => {
            const click = () => {
                const api = params.api;
                const fields = api
                .getAllColumns()
                .map((c) => c.field)
                .filter((c) => c !== "__check__" && !!c);

                // send to delete user function
                deleteUser(params.getValue("id"), params.getValue("type"))
            }
            return (<IconButton aria-label="delete" onClick={click}><DeleteIcon /></IconButton> )
        }}
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
            setUsers(res.data.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }


    const deleteUser = async(user_id, u_type) => {
		const data={
            uid: user_id,
            type: u_type,
		}
		
		await axios.post(deleteUserUrl, data)
		.then(res => {
            console.log(res)
            getUsers();
		})
		.catch((error) => {
			console.log(error)
		})
    }


    const renderUsers = () => {
		const rows = []
		users.map((user) => {
            if(user[1].type != "admin"){
                rows.push({
                    id: user[0],
                    first_name: user[1].first_name,
                    last_name: user[1].last_name,
                    email: user[1].email,
                    type: user[1].type,
                })
            }
        })
        console.log(rows)
		return rows
	};
    
    return(
        <Grid>
            <Row noGutters fluid><TitleBar name={window.localStorage.getItem("name")}/></Row>
            <Row noGutters style={{height:'100vh',paddingTop: 60}}>
                <Col sm={2}>
                    <SideMenu random={[
                        {'text':'Jobs','href': '/admindashboard', 'active': false},
                        {'text':'Users','href': '/admin/userlist', 'active': true}]}/>
                </Col >
                <Col sm="9">
                <Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
                    Users
                </Typography>
                <Row>
                    <div style={{ height: 600, width: '100%', marginLeft: 100 }}>
                        <DataGrid rows={renderUsers()} columns={columns} pageSize={20}/>
                    </div>
                </Row>
            </Col>
            </Row>
            
        </Grid>
    );
}