import React, { useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import { Grid, CircularProgress } from "@material-ui/core";
import {Col, Row} from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import TitleBar from "../SharedComponents/TitleBar.js";
import SideMenu from "../SharedComponents/SideMenu.js";
import { DataGrid } from '@material-ui/data-grid';
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import checkAuth from "../Authentication/Authenticate";

export const advertisementUrl="http://localhost:5000/advertisement"
export const offerUrl="http://localhost:5000/offerslist"
// export const offerUrl="http://localhost:5000/offers"

export default function OfferList({match}) {
	const jobID = match.params.jobID;
	const [userID, setUserID] = useState('');
	// const recruiterID = sessionStorage.getItem("uid")
	const history = useHistory();
	const [loading, setLoading] = useState(true);
	const [offers, setOffers] = useState([])
	const [job, setJob] = useState([])

	const columns = [
		{ field: 'candidate', headerName: 'Candidate', width: 200, 
			renderCell: (row) => (<Link to={"/viewapplication/"+jobID+'/'+row.data.appID}>{row.value}</Link>)},
		{ field: 'status', headerName: 'Status', width: 200 },
		{ field: 'offer',
				headerName: 'Offer',
				sortable: false,
				renderCell: (row) => (<Link to={{ pathname: `/offer/${row.data.id}` }}> {row.value}</Link>),
				width: 400 },
	];

	useEffect(() => {
		auth();
		getJob();
		getOffers();
	}, [userID]); // eslint-disable-line react-hooks/exhaustive-deps

	const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				setLoading(false)
				if (!response.success || response.userInfo["type"] !== "recruiter") {
					history.push("/unauthorised");
				}
				setUserID(response.userID)
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
				appID: offer[1].application_id,
                candidate: offer[1].full_name,
                status: offer[1].status,
                offer: "View Offer"})
		))
		return rows
	};

	return loading ? (
		<div style={{
			position: 'absolute', left: '50%', top: '50%',
			transform: 'translate(-50%, -50%)'
			}}>
			<CircularProgress/>
		</div>
	) : (
		job.map((detail) => (
			<Grid>
				<Row noGutters fluid><TitleBar name={window.localStorage.getItem("name")}/></Row>
				<Row noGutters style={{height:'100vh',paddingTop: 60}}>
					<Col sm="2">
					<SideMenu random={[
						{'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': false},
						{'text': detail[1].title,'href': '#','active': false,
						'nested':[
							{'text':'Applications','href': `/applications/${jobID}`,'active': false},
							{'text':'Interviews','href': `/interviews/${jobID}`,'active': false},
							{'text':'Offers','href': `/offers/${jobID}`,'active': true},
							{'text': 'Statistics','href': `/jobstatistics/${jobID}`,'active': false},
						]},
						{'text':'FAQ','href':'/recruiterFAQ','active': false}]}/>

					</Col>

					<Col sm="9">
						<Typography variant="h4"  style={{color: 'black', textAlign: "center",margin:20 }}>
							{detail[1].title}
						</Typography>
						<Typography variant="h6"  style={{color: 'black', textAlign: "center",margin:20 }}>
							{detail[1].company} | 
							{detail[1].status==="open"? (' Closing date: '+detail[1].closing_date) : ' This job has closed'}
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