import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Link, Grid} from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import {Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const url="http://localhost:5000/getOfferDetails"

export default function ViewApplication() {
    const history = useHistory();
    const href = `${window.location.href}`.split("/")
    const offerId = href[4]
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
        axios.post(url, ndata)
                .then(function(response) {
                    console.log("response:", response.data)
                    /*initialise(response.data)*/
                    setOffer(response.data.offers[0][1])
                    console.log(response.data.offers[0][1].additional_docs)
                })
                .catch(function(error) {
                    console.log(error.response)
                })

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
                            {documentsList.map((document) => (
                                <ul>
                                    <Link href={files[document]} target="_blank">
                                        <PictureAsPdfIcon color = "secondary"/>{document}
                                    </Link>
                                </ul>
                            ))}
                        </Box>
                    </Typography>
                </Col>
			</Row>
		</Grid>
	);
}

