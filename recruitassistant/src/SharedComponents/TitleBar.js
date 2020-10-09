import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { TextField, Button, Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";


export default function TitleBar() {
		const history = useHistory();

    async function logout () { 
			window.sessionStorage.clear()
            window.localStorage.clear()
			history.push("/")
    }

    return(
        <nav className="navbar navbar-dark fixed-top flex-md-nowrap p-0 shadow"
        style={{"backgroundColor": '#348360'}}>
            <a className="navbar-brand col-sm-3" href="#">RecruitAssistant</a>
            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap">
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