import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { List, ListItem, ListItemText, Collapse, Divider } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { useHistory } from "react-router-dom";

export default function SideMenu(props) {
	const [open, setOpen] = useState(true)
	const history = useHistory();

	function logout () { 
		window.sessionStorage.clear()
		window.localStorage.clear()
		history.push("/")
	}

	return(
		<div style={{position: 'fixed', width: '15%','height': '100%','backgroundColor': "#DEDEDE" }}>
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
				{window.localStorage.getItem("name")!=null && (
						<ListItem button onClick={logout} key={'logout'} style={{width:'15%', position:'fixed', bottom:0}}>
							<ListItemText primary={'LOGOUT'} style={{color: '#348360'}}/>
						</ListItem>
					)}
			</List>
		</div>
		)
}