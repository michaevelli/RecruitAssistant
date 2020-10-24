import React from "react";
import {Row} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import handshake2 from './Images/handshake2.svg';
import checklist from './Images/checklist.png';
import connections from './Images/connections.png';
import logo from './SharedComponents/Picture2.png';
import {Button, Grid} from "@material-ui/core";
import { useHistory } from "react-router-dom";

export default function Home() {

	const history = useHistory();
	return (
		<Grid style={{backgroundColor: "F1F1F1"}}>
			<Row>	
				<nav className="navbar navbar-dark fixed-top flex-md-nowrap p-0 shadow"
				style={{"backgroundColor": '#348360'}}>
					<img
					src={logo}
					alt="logo"
					style={{ width:255, height:60}}/>
					<ul className="navbar-nav px-3">	
						<li className="nav-item text-nowrap">
							<Button 
								onClick={() => history.push("/login")}
								variant="contained"
								style={{"margin":5}}>
								Log In
							</Button>
							<Button 
								onClick={() => history.push("/signup")}
								variant="contained"
								style={{"margin":5}}>
								Sign Up
							</Button>
						</li>
           		 	</ul>
        		</nav>
			</Row>
			<Row>
				<div class="container marketing">
					<hr />
					<div class="row" style={{  margin:120, marginTop:200}}>
						<div class="col-md-7">
							<h2 >RecruitAssistant. 
							<span class="text-muted"> Connect with the right people.</span></h2>
							<p class="lead">
								RecruitAssistant matches the best companies with the best candidates.		
							</p>
						</div>
						<div class="col-md-5">
							<img class="img-fluid mx-auto" src={connections}
							alt="Generic placeholder image"/>
						</div>
					</div>

					<hr />

					<div class="row" style={{ margin:120}}>
						<div class="col-md-7 order-md-2">
							<h2>Employers</h2>
							<p class="lead">
								Manage the recruitment process from advertising to offers. 
								<ul>
								<li>Automatic sorting of candidates by suitability</li>
								<li>Easily send interview invites and offers to top candidates </li>
								<li>Keep track of candidate status as they progress through the recruitment process</li>
								</ul>
							</p>
						</div>
						<div class="col-md-5 order-md-1">
							<img class="img-fluid mx-auto rounded" src={checklist} style={{width: 170, height:220}} alt="Generic placeholder image"/>
						</div>
					</div>

					<hr />

					<div class="row" style={{ margin:120}}>
						<div class="col-md-7">
							<h2>Job Seekers</h2>
							<h3><span class="text-muted">Find your dream Job.</span></h3>
							<p class="lead">
								<ul>
									<li>Search for jobs that match your needs with 6+ criteria</li>
									<li>Keep track of your offers and interview dates in one handy place</li>
								</ul>
							</p>
						</div>
						<div class="col-md-5">
							<img class="img-fluid mx-auto" src={handshake2} style={{width: 240, height:220}} alt="Generic placeholder image"/>
						</div>
					</div>
					
					<div class="row" style={{ marginLeft:'45%', marginBottom: '5%'}}>
						<Button variant="contained" color="secondary" href="/signup"
						style={{ width:200, height:60}}>
							Sign Up Today!
						</Button>
					</div>
				</div>
			</Row>
		</Grid>
	)
}