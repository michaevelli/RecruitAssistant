import React, { useState, useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link,Slider, Grid,Card,CardContent,Button,CardActions ,TextField,FormControl,InputLabel,MenuItem,Select} from "@material-ui/core";
import {Form,Container,Col,Row,Collapse} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const offerUrl="http://localhost:5000/offers"
export const searchUrl="http://localhost:5000/search/"

export default function Offers() {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [offers, setOffers]=useState([])
    

    useEffect(() => {
		auth();
		getOffers();
    }, []);

    const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				setLoading(false)				
				if (!response.success || response.userInfo["type"] != "jobseeker") {
					history.push("/unauthorised");
				}
			})
	}

	const getOffers = async () => {
		const url = `${offerUrl}`
            
            const ndata = {
                token: window.localStorage.getItem("token")
            }
            
            axios.post(url, ndata)
                .then(function(response) {
					console.log("response:", response.data)
					setOffers(response.data.offers)
                })
                .catch(function(error) {
                    console.log(error.response)
                })
	};
    
    const renderOffers = () => {
		return offers.map((offer) => (
			<Card style={{margin: 30, height: 160, width:250}}>
				<CardContent>                          
					<Typography variant="h5" component="h2">
						{offer[1].title}
					</Typography>
					<Typography color="textSecondary">
						{offer[1].company} | {offer[1].location}
					</Typography>
				</CardContent>
				<CardActions >
					<Typography color="textSecondary">
						{offer[1].job_type}
					</Typography>
					<Link href= {`/offer/${offer[0]}`} style={{marginLeft: 30}}>
							View Offer
					</Link>
				</CardActions>
			</Card>
		))
	}

    return loading ? (
		<div></div>
	) : (
		<Grid>      
			<Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 60}}>
				<Col sm={2}>
					<SideMenu random={[
						{'text':'Job Seeker Dashboard','href': 'jobseekerdashboard', 'active': false},
						{'text':'Your Applications','href': 'offers', 'active': true},         
						{'text':'FAQ','href':'#','active': false}]}/>
				</Col >
				<Col>	
					<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
						Your Offers
					</Typography>
					<div className="card-deck"  style={{ display: 'flex', flexWrap: 'wrap',justifyContent: 'normal', paddingLeft:'5%'}}>
						{renderOffers()}
					</div>
				</Col>
			</Row>
		</Grid>
	);
}