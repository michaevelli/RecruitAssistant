import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { TextField, Button, Grid } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import { useHistory, withRouter } from "react-router-dom";
import logo from './Picture2.png'; 

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
			style={{"backgroundColor": '#348360'}}>
			<img
				src={logo}
				alt="logo"
				style={{ width:255, height:60}}/>
			<ul className="navbar-nav px-3">
				<li className="nav-item text-nowrap">
					<Typography variant="overline" style={{color:"white"}}>
						Welcome {window.localStorage.getItem("name")}
					</Typography>
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
