import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Button, Grid} from "@material-ui/core";
import {Col,Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";


export const jobUrl="http://localhost:5000/retrieveapplication"

export default function ViewApplication() {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const href = `${window.location.href}`.split("/")
    const applicationID = href[href.length - 1]
    const jobID = href[href.length - 2]
    const [application, setApp] = useState({})
    const [job, setJob] = useState({})

    useEffect(() => {
        auth();
        getApplication();
	}, []);

    const auth = async () => {
        console.log(applicationID)
        console.log(jobID)
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
                console.log("auth success: ", response)
				setLoading(false)
				if (!response.success || response.userInfo["type"] != "recruiter") {
					history.push("/unauthorised");
				}
			})
    }
    

    const getApplication = async (event) => {
        await axios.get(jobUrl, {
            params: {
                app_id: applicationID,
                job_id: jobID,
            },
        })
        .then(res => {
            setJob(res.data.jobinfo)
            setApp(res.data.applications)
            console.log("response: ", res.data.applications)
            console.log("response: ", res.data.jobinfo)
        })
        .catch((error) => {
            console.log("error: ", error.response)
        })

    }

    return loading ? (
		<div></div>
	) : (
        <Grid>      
			<Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 60}}>
				<Col sm={2}>
					<SideMenu random={[
						{'text':'Dashboard','href': '/recruiterdashboard', 'active': true},
						{'text':'FAQ','href':'#','active': false}]}/>
				</Col >
                <Col>
                    <Typography component="div" style={{color: 'black', margin: 50}}>
                        <Box fontSize="h3.fontSize" fontWeight="fontWeightBold">
                            Applicant: {application.first_name} {application.last_name}
                        </Box>
                        <Box fontSize="h5.fontSize">
                            Job: {job.title}
                        </Box>
                        <br></br>
                        <Box fontSize="h6.fontSize">
                            Phone Number: {application.phone_number}
                        </Box>
                        <br></br>
                        <Box fontSize="h6.fontSize" lineHeight={2}>
                                Qualifications:
                                {application.qualification}
                            </Box>
                    </Typography>
                </Col>
			</Row>
		</Grid>
	);
}


