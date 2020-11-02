import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import { Grid } from "@material-ui/core";
import {Col, Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import { DataGrid } from '@material-ui/data-grid';
import axios from "axios";
import { useHistory } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const advertisementUrl="http://localhost:5000/advertisement"
export const offerUrl="http://localhost:5000/offerslist"

export default function OfferList({match}) {
	const jobID = match.params.jobID;
	const recruiterID = sessionStorage.getItem("uid")
	const history = useHistory();
	const [loading, setLoading] = useState(true);
	const [offers, setOffers] = useState([])
	const [job, setJob] = useState([])

	const columns = [
		{ field: 'candidate', headerName: 'Candidate', width: 300 },
		{ field: 'status', headerName: 'Status', width: 400 },
		{ field: 'counteroffer', headerName: 'Counter Offer', width: 300 },
	];

	useEffect(() => {
		auth();
		getJob();
		getOffers();
	}, [recruiterID]);

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				setLoading(false)
				if (!response.success || response.userInfo["type"] != "recruiter") {
					history.push("/unauthorised");
				}
			})
	}

	const getJob = async () => {
		const url = `${advertisementUrl}`
		console.log(url)
		await axios.get(url, {
			params: {
				job_id: jobID
			},
		})
			.then(res => {
				setJob(res.data.job)
				console.log("response: ", res)
			})
			.catch((error) => {
				console.log("error: ", error.response)
			})
	};

	const getOffers = async () => {
		const url = `${offerUrl}`
		console.log(url)
		await axios.get(url, {
			params: {
				job_id: jobID
			},
		})
			.then(res => {
				setOffers(res.data.offers)
				console.log("response: ", res)
			})
			.catch((error) => {
				console.log("error: ", error.response)
			})
	};

	const renderOffers = () => {
		const rows = []
		offers.map((offer) => (
			rows.push({
                id: offer[0],
                candidate: offer[1].full_name,
                status: offer[1].status,
                counteroffer: null})
		))
		return rows
	};

	return loading ? (
		<div></div>
	) : (
		job.map((detail) => (
			<Grid>
				<Row noGutters fluid><TitleBar name={window.localStorage.getItem("name")}/></Row>
				<Row noGutters style={{height:'100vh',paddingTop: 60}}>
					<Col sm="2">
					<SideMenu random={[
							{'text':'Job View','href': '#','active': false,
							'nested':[
								{'text':'Applications','href': `/applications/${jobID}`,'active': false},
								{'text':'Interviews','href': `/interviews/${jobID}`,'active': false},
								{'text':'Offers','href': '#','active': true},
							]},
							{'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': false},
							{'text':'FAQ','href':'/recruiterFAQ','active': false}
						]}/>
					</Col>

					<Col sm="9">
						<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
							{detail[1].title} @ {detail[1].company}
						</Typography>
						<Row>
							<div style={{ height: 600, width: '100%', marginLeft: 100 }}>
								<DataGrid rows={renderOffers()} columns={columns} pageSize={10}/>
							</div>
						</Row>
					</Col>
				</Row>
			</Grid>
		))
	);
}