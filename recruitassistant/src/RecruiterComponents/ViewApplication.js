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


export const jobUrl="http://localhost:5000/retrieveapplication"

export default function ViewApplication() {
    const history = useHistory();
    const href = `${window.location.href}`.split("/")
    const applicationID = href[href.length - 1]
    const jobID = href[href.length - 2]
    const [application, setApp] = useState({})
    const [job, setJob] = useState({})
    const [qualifications, setQualifications] = useState([])
    const [documentsList, setDocumentsList] = useState([])
  

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
				if (!response.success || response.userInfo["type"] != "recruiter") {
					history.push("/unauthorised");
				}
			})
    }
    

    const getApplication = async () => {
        await axios.get(jobUrl, {
            params: {
                app_id: applicationID,
                job_id: jobID,
            },
        })
        .then(res => {
            initialise(res.data)
           // console.log("response: ", res.data.applications)
           // console.log("response: ", res.data.jobinfo)
        })
        .catch((error) => {
            console.log("error: ", error.response)
        })

    }

    const initialise = (data) => {
        setJob(data.jobinfo)
        setApp(data.applications)
        if (data.jobinfo.req_qualifications){
            setQualifications( data.jobinfo.req_qualifications.split(","))
        }else{
            setQualifications([])
        }
       
        setDocumentsList(data.applications.submitted_docs || [])
    }
    //example of how to download a pdf in browser
	const downloadFile = async (data,filename) =>{		
		
        const linkSource = data;
        const downloadLink = document.createElement("a");
        const fileName = filename;
    
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();	
		
	}
   
    return (
        <Grid>      
			<Row noGutters fluid><TitleBar/></Row>
			<Row noGutters style={{height:'100vh',paddingTop: 60}}>
				<Col sm={2}>
					<SideMenu random={[
						{'text':'Recruiter Dashboard','href': '/recruiterdashboard', 'active': true},
						{'text':'FAQ','href':'/recruiterFAQ','active': false}]}/>
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
                            {qualifications.map((quality) => (
                                <ul>
                                    <CheckIcon hidden = {!application.qualifications.includes(quality)}/>
                                    <ClearIcon hidden = {application.qualifications.includes(quality)}/>
                                    {quality}
                                </ul>
                            ))}
                        </Box>
                        <Box fontSize="h6.fontSize" lineHeight={2}>
                            Documentation:
                            {documentsList.map((document) => (
                                <ul>
                                    <Link style={{ cursor: 'pointer'}} onClick={()=>downloadFile(document.src,document.filename)} target="_blank">
                                        <PictureAsPdfIcon color = "secondary"/>{document.req_document}
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


