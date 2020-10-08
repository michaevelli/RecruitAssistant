import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';

// TODO https://www.w3schools.com/howto/howto_js_navbar_sticky.asp
//make sticky - currently on some pages it disappears if you scroll too far down
export default function SideMenu(props) {
   
    return(
        <div style={{'height': '100vh','backgroundColor': "#DEDEDE"}}>
                <nav class="navbar " style={{'position':'fixed'}}>
                <ul class="navbar-nav" >

               {
                   props.random.map( (entry,index)=>

  
                     (<li class="nav-item" >
                    <a class="nav-link"
                     href={entry.href}
                     style={ entry.active ?{color: '#348360' , fontWeight:'bold' }: { color: '#348360' }  }
                    >{entry.text}</a>
                    </li>))
                    
                   
               }
            
                </ul> 
                </nav>
                
                </div>

    );
}