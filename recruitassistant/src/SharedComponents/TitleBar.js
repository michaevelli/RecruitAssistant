import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { TextField, Button, Grid, Typography, AppBar, Toolbar, IconButton } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import { useHistory, withRouter } from "react-router-dom";
import logo from './Picture2.png'; 
import Notifications from "./Notifications.js";


export default function TitleBar() {
	// console.log("props:", props);
	const history = useHistory();

	async function logout () { 
		window.sessionStorage.clear()
		window.localStorage.clear()
		history.push("/")
	}

	return(
		<nav className="navbar navbar-dark fixed-top flex-md-nowrap p-0 shadow"
			style={{"backgroundColor": '#348360', zIndex: 100}}>
			<div>
				{/* &nbsp;&nbsp;&nbsp;&nbsp;
				<IconButton edge="start" color="inherit" aria-label="menu">
					<MenuIcon />
				</IconButton> */}
				<img
					src={logo}
					alt="logo"
					style={{ width:255, height:60}}/>
			</div>
			<ul className="navbar-nav px-3">
				<li className="nav-item text-nowrap">
					<Typography variant="overline" style={{color:"white",marginRight:30}}>
						Welcome {window.localStorage.getItem("name")}
					</Typography>
					<Notifications></Notifications>
					<Button 
						onClick={() => {logout()}}
						variant="contained"
						style={{"margin":5}}>
						Log Out
					</Button>
				</li>
			</ul>
		</nav>
		
	);
}
