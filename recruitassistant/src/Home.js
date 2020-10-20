import React from "react";
import {Form,Container,InputGroup,Col,Row, Carousel, Image} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import test from './Images/test.png';
import handshake from './Images/handshake.jpg';
import logo from './SharedComponents/Picture2.png';
import {Button, Grid} from "@material-ui/core";

export default function Home() {

	var backgroundStyle = {
		width: "100%",
		height: "100%",
		
	};

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
								variant="contained"
								style={{"margin":5}}>
								Log In
							</Button>
							<Button 
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
					<div class="row" style={{ margin:120}}>
					<div class="col-md-7">
						<h2 >Recruit Assistant. 
						<span class="text-muted"> Connect with the right people.</span></h2>
						<p class="lead">
							RecruitAssistant matches the best Companies with the best Candidates.		
						</p>
					</div>
					<div class="col-md-5">
						<img class="img-fluid mx-auto" src={handshake} alt="Generic placeholder image"/>
					</div>
					</div>

					<hr />

					<div class="row" style={{ margin:120}}>
					<div class="col-md-7 order-md-2">
						<h2>Recruiting Made Easy. </h2>
						<p class="lead">
							Manage the recruitment process from advertising to offers. 
							<ul>
							<li>Automatic sorting of candidates by suitability</li>
							<li>Easily send interview invites and offers to top candidates </li>
							<li>Keep track of interview and offers status all in one 
								convienient place. </li>
							</ul>
						</p>
					</div>
					<div class="col-md-5 order-md-1">
						<img class="img-fluid mx-auto rounded" src={handshake} alt="Generic placeholder image"/>
					</div>
					</div>

					<hr />

					<div class="row" style={{ margin:120}}>
					<div class="col-md-7">
						<h2>Find your dream Job </h2>
						<p class="lead">
							<ul>
								<li>Search for jobs that match your needs with 6+ criteria.</li>
								<li>Apply in 2 clicks.</li>
								<li>Keep track of your offers and interview dates in one handy place. </li>
							</ul>
						</p>
					</div>
					<div class="col-md-5">
						<img class="img-fluid mx-auto" src={handshake} alt="Generic placeholder image"/>
					</div>
					</div>
					<div class="row" style={{ marginLeft:'40%', marginBottom: '20%'}}>
					<Button variant="contained" color="secondary" href="#">
						Sign Up Today!
					</Button>
					</div>
				</div>
			</Row>
		</Grid>
	)
}