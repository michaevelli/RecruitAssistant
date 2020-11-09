import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { List, ListItem, ListItemText, Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

export default function SideMenu(props) {
	const [open, setOpen] = useState(true)

	return(
		<div style={{'height': '100%','backgroundColor': "#DEDEDE" }}>
			{/* <nav class="navbar sticky" style={{'position':'fixed'}}> */}
				{/* <ul class="navbar-nav"> */}
					<List>
						{props.random.map((entry, index) => (
							<div>
								<ListItem button component="a" href={entry.href} key={entry.text}
									selected={entry.active ? true : false}>
									<ListItemText primary={entry.text}
										primaryTypographyProps={entry.active?{
										style:{fontWeight:'bold', color: '#348360'}} : {
										style:{color: '#348360'}}}
									/>
									{entry.nested && <div>{open ? 
										<ExpandLess onClick={() => {setOpen(false)}}/> : 
										<ExpandMore onClick={() => {setOpen(true)}}/>}</div>}
								</ListItem>
								{entry.nested && entry.nested.map((nested_link,index) => (
								<Collapse in={open}>
									<List component="div" disablePadding>
										<ListItem button component="a" href={nested_link.href} key={nested_link.text}
											selected={nested_link.active ? true : false}>
											<ListItemText primary={nested_link.text}
												primaryTypographyProps={nested_link.active?{
												style:{fontWeight:'bold', color: '#348360', marginLeft: 20}} : {
												style:{color: '#348360', marginLeft: 20}}}
											/>
										</ListItem>
									</List>
								</Collapse>))}
							</div>
						))}
					</List>
				{/* </ul>    */}
			{/* </nav> */}
		</div>
		)
}