import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';


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