import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Typography} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import logo from './Picture2.png'; 
import Notifications from "./Notifications.js";


export default function TitleBar() {
	const history = useHistory();

	return(
		<nav className="navbar navbar-dark fixed-top flex-md-nowrap p-0 shadow"
			style={{"backgroundColor": '#348360', zIndex: 100}}>
			<div>
				<img
					src={logo}
					alt="logo"
					style={{ width:255, height:60}}/>
			</div>
			<ul className="navbar-nav px-3">
				<li className="nav-item text-nowrap">
					{window.localStorage.getItem("name")!=null && (
						<Typography variant="overline" style={{color:"white",marginRight:30}}>
							Welcome {window.localStorage.getItem("name")}
						</Typography>
					)}
					{window.localStorage.getItem("name")!=null && <Notifications/>}
					{window.localStorage.getItem("name")==null && (
						<Button 
							onClick={() => {history.push("/login")}}
							variant="contained"
							style={{"margin":5}}>
							Login
						</Button>
					)}
					&nbsp;&nbsp;
				</li>
			</ul>
		</nav>
		
	);
}
