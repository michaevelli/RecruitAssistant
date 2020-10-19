import React from "react";
import {Form,Container,InputGroup,Col,Row, Carousel, Image} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import test from './Images/test.png';
import logo from './SharedComponents/Picture2.png';

export default function Home() {

	var backgroundStyle = {
		width: "100%",
		height: "100%",
		backgroundImage: `url(${test})`
	};

	return (
		<Carousel>
			<Carousel.Item style={backgroundStyle}>
				<div style={{ width:"100%", height:"100vh"}} className="align-items-center">
					<Container>
						<Row className="align-items-center">
							<Col style={{overflow: "auto"}}>
								<Image src={logo} fluid/>
							</Col>
							<Col style={{textAlign:'center'}}>
								<p>Welcome to Recruit Assist</p>
							</Col>
						</Row>
					</Container>
				</div>				
			</Carousel.Item>
			<Carousel.Item style={backgroundStyle}>
				<div style={{ width:"100%", height:"100vh"}}>
					<img src={logo}/>
				</div>	
			</Carousel.Item>
			<Carousel.Item style={backgroundStyle}>
				<div style={{ width:"100%", height:"100vh"}}>
					<img src={logo}/>
				</div>	
			</Carousel.Item>
		</Carousel>
	)
}