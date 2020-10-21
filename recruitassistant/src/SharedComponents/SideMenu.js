import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';


export default function SideMenu(props) {
   
    return(
        <div style={{'height': '100%','backgroundColor': "#DEDEDE" }}>
            <nav class="navbar sticky" style={{'position':'fixed'}}>
                <ul class="navbar-nav">
                    {
                    props.random.map( (entry,index)=>{
                        return (
                        <li class="nav-item" >
                           <a class="nav-link"
                            href={entry.href}
                            style={ entry.active ?{color: '#348360' , fontWeight:'bold' }: { color: '#348360' }  }
                            >
                            {entry.text}

                            {entry.nested && entry.nested.map((nested_link,index) => (

                                <a class="nav-link"
                                href={nested_link.href}
                                style={ nested_link.active ?{color: '#348360', marginLeft: 15,fontWeight:'bold' }: {marginLeft: 15, color: '#348360' }  }
                                >
                                {nested_link.text}</a>
                            ))}

                            </a>
                        </li>
                        )}
                    )}
                </ul>          
            </nav>
        </div>
        )
}