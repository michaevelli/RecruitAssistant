import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';


export default function SideMenu(props) {
   
    return(
        <div style={{'height': '100vh','backgroundColor': "#DEDEDE"}}>
                <nav class="navbar " style={{'position':'fixed'}}>
                <ul class="navbar-nav" >

               {
                   props.random.map( (entry,index)=>
                     (<li class="nav-item" >
                    <a class="nav-link" href="#">{entry}</a>
                    </li>)
                   )
               }
                </ul> 
                </nav>
                </div>

    );
}