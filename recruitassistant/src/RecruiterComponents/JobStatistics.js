import React, {useState,useEffect } from "react";
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
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
    PieChart, Pie, Legend, Tooltip,ResponsiveContainer
  } from 'recharts';
export const statsURL="http://localhost:5000/jobstats"

export default function JobStatistics({match}) {
  const COLORS=['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']
	const history = useHistory();
	const [loading, setLoading] = useState(true);
	const jobID = match.params.jobID;
  const [stats, setStats]=useState({})
  const [workingRights, setWorkingRights]=useState([])
  const [numCandidates, setNumCandidates]=useState(0)
  const [numOffers, setNumOffers]=useState(0)
  const [numInterviews, setNumInterviews]=useState(0)
  const [qualificationsInfo, setQualificationsInfo]=useState([])
  const [numQualifications, setNumQualifications]=useState([])
	useEffect(() => {
		auth();
		getJobStats();		
    }, []);

    const auth = async () => {
		await checkAuth(window.localStorage.getItem("token"))
			.then(function(response) {
				console.log("auth success: ", response)
				setLoading(false)
				if (!response.success || response.userInfo["type"] !== "recruiter") {
					history.push("/unauthorised");
				}
			})
    }
    const getJobStats = async () => {

    const url = `${statsURL}`
		console.log(url)
		await axios.get(url, {
				params: {
					job_id: jobID
				},
			})
			.then(res => {
                const stats=res.data.stats
                setStats()
                setWorkingRights([{name: 'Yes', value: parseInt(stats.has_working_rights)},
                {name: 'No', value: stats.num_candidates-parseInt(stats.has_working_rights)}])
                console.log("response: ", res)
                setNumCandidates(stats.num_candidates)
                setNumOffers(stats.num_offers)
                setNumInterviews(stats.num_interviews)
              
                const dict = stats.qualifications;
                var r=[]
                for (const [key, value] of Object.entries(dict)) {
                  
                  r.push({'name':key,'Number of Candidates':parseInt(value)})
                }
                setQualificationsInfo(r)
                
                var q=[]
                for(var i=0; i<=stats.max_qualities_met; i++){
                  q.push({name: String(i), value: parseInt(stats.num_qualities_met[i]) || 0 })
                }
                console.log(q)
                setNumQualifications(q)
                
			})
			.catch((error) => {
				console.log("error: ", error.response)
			})
    }
 
    const WorkingRights = ()=>{      
          return (
            
            <ResponsiveContainer width="99%" aspect={3}>
            <PieChart title='yyee' >
            <Pie data={workingRights}  innerRadius={60} outerRadius={80}>
            {
          	workingRights.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
            }
            </Pie>
            <Tooltip/>
            <Legend />
           </PieChart>
           </ResponsiveContainer>
          
          
        );
      }
      const qualificationsPie = ()=>{
        return (
          
          <ResponsiveContainer width="99%" aspect={3}>
          <PieChart title='yyee'>
          <Pie data={qualificationsInfo}  dataKey="Number of Candidates"  innerRadius={60} outerRadius={80}>
          {
          qualificationsInfo.map((entry, index) => <Cell fill={COLORS[(index+5) % COLORS.length]}/>)
          }
          </Pie>
          <Tooltip/>
          <Legend />
         </PieChart>
         </ResponsiveContainer>
      
        )
      }
      const numberQualificationsBar = ()=>{
        
        return ( 
         
         <ResponsiveContainer width="99%" aspect={3}>
        <BarChart
          data={numQualifications}
          dataKey="value"
       
        >
        <CartesianGrid  />
        <XAxis  label={{ value: 'Number of qualifications met'}}  dataKey="name"/>
        <YAxis label={{ value: "Number of applicants", angle: -90}} 
        allowDecimals={false} />
        <Tooltip />
        
        
        <Bar dataKey="value" fill="#aaffc3"/>
       
      </BarChart>
      </ResponsiveContainer>
      
    );
    }
    
    
    
    return (	
    <Grid>      
        <Row noGutters fluid><TitleBar name={window.localStorage.getItem("name")}/></Row>
        <Row noGutters style={{height:'100vh',paddingTop: 60}}>
            <Col sm={2}>
                <SideMenu random={[
                    {'text':'Recruiter Dashboard','href': '/recruiterdashboard', 'active': false},
                    {'text':'Statistics','href': '/statistics', 'active': true},         
                    {'text':'FAQ','href':'/recruiterFAQ','active': false}]}/>
            </Col >
            
            <Col>
            <Row noGutters>
              
                <Col >
                 
                  
                  <span style={{fontWeight:"bold"}}>Number of applicants:  </span>{numCandidates}
                  
                  <br/>
                  
                  <span style={{fontWeight:"bold"}}>Number of Interviews sent: </span>{numInterviews}
                  
                  <br/>
                  
                  <span style={{fontWeight:"bold"}}>Number of Offers sent: </span>{numOffers}
                  
                 
                  </Col>
                  <Col >
                  <Typography component="div" style={{color: 'black'}}>
                    <Box fontSize="h8.fontSize">
                    Number of Applicants with working rights for this job
                    {WorkingRights()}
                    </Box>
                  </Typography>
                  </Col>
                
            </Row>
          
            <Row style={{marginTop:30}} noGutters>
              <Col >
                
                How many applicants meet each qualification
                {qualificationsPie()}
                
              </Col>
              <Col>
                
                Number of required qualifications that applicants meet
                {numberQualificationsBar()}
               
              </Col>
            </Row>
          </Col>
        </Row>
    </Grid>);

}