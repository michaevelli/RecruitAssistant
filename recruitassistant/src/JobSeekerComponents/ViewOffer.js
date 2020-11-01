import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link, Grid} from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import {Col,Row, Button} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";
import CounterOffer from "./CounterOffer";

export const offerdetailsurl="http://localhost:5000/getOfferDetails"

export default function ViewApplication({match}) {
	const history = useHistory();
	const offerId = match.params.offerID
	const [offer, setOffer] = useState({})
	const [documentsList, setDocumentsList] = useState([])
	const [files, setFiles] = useState({})

	useEffect(() => {
		auth();
		getApplication();
	}, []);

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				if (!response.success || response.userInfo["type"] != "jobseeker") {
					history.push("/unauthorised");
				}
			})
	}

	const getApplication = async () => {
		const ndata = {
			offerId: offerId
		}
		axios.post(offerdetailsurl, ndata)
				.then(function(response) {
					console.log("response:", response.data)
					/*initialise(response.data)*/
					setOffer(response.data.offer)
					setDocumentsList(response.data.offer.additional_docs)
					
				})
				.catch(function(error) {
					console.log(error.response)
				})

	}

	const downloadFile = async (data,filename) =>{			
		const linkSource = data;
		const downloadLink = document.createElement("a");
		const fileName = filename;
	
		downloadLink.href = linkSource;
		downloadLink.download = fileName;
		downloadLink.click();		
	}

	const renderDocumentItems = () => {
		if (documentsList == []) {
			return <div></div>
		} else {
			return (
				documentsList.map((document) => (
					<ul>
						<Link style={{ cursor: 'pointer'}} onClick={()=>downloadFile(document.src,document.filename)} target="_blank">
							<PictureAsPdfIcon color = "secondary"/>{document.filename}
						</Link>
					</ul>
				))
			)
		}
	}

	const handleEdit = () => {
		history.push("/editoffer/"+offerId)
	}
	


	return (
		<Grid>      
			<Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 60}}>
				<Col sm={2}>
					<SideMenu random={[
						{'text':'Job Seeker Dashboard','href': '/jobseekerdashboard', 'active': false},
						{'text':'Your Applications','href': '/offers', 'active': true},         
						{'text':'FAQ','href':'/jobseekerFAQ','active': false}]}/>
				</Col >
				<Col>
					<Typography component="div" style={{color: 'black', margin: 50}}>
						<Box fontSize="h3.fontSize" fontWeight="fontWeightBold">
							Offer: {offer.title}
						</Box>
						<Box fontSize="h5.fontSize">
							Company: {offer.company}
						</Box>
						<br></br>
						<Box fontSize="h8.fontSize">
							{offer.description}
						</Box>
						<Box fontSize="h6.fontSize">
							Date Posted: {offer.date_posted}
						</Box>
						<Box fontSize="h6.fontSize">
							Start Date: {offer.start_date}
						</Box>
						<Box fontSize="h6.fontSize">
							End Date: {offer.end_date}
						</Box>
						<Box fontSize="h6.fontSize">
							Days: {offer.days}
						</Box>
						<Box fontSize="h6.fontSize">
							Hours: {offer.hours}
						</Box>
						<Box fontSize="h6.fontSize">
							Job Type: {offer.job_type}
						</Box>
						<Box fontSize="h6.fontSize">
							Location: {offer.location}
						</Box>
						<Box fontSize="h6.fontSize">
							Salary: {offer.salary} {offer.salary_type}
						</Box>
						<Box fontSize="h6.fontSize" lineHeight={2}>
							Documentation:
							{renderDocumentItems}
						</Box>
					</Typography>
					<Button variant="contained" color="secondary" onClick={handleEdit} style={{margin: 20}}>
						Edit Offer
					</Button> 
					<CounterOffer offerID={offerId}/>
				</Col>
			</Row>
		</Grid>
	);
}


