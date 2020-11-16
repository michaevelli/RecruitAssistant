import React, {useState,useEffect } from "react";
import  'bootstrap/dist/css/bootstrap.css';
import {Grid,CircularProgress, Typography} from "@material-ui/core";
import {Col,Row,Card} from 'react-bootstrap';
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
  const COLORS=[ '#2ecc71', '#e74c3c','#1abc9c', '#3498db', '#9b59b6', '#34495e', '#16a085', '#f1c40f', '#d35400', '#c0392b', '#bdc3c7']
	const [loading, setLoading] = useState(true);
  const jobID = match.params.jobID;
  const history = useHistory();

  //are there any statistics for this job/are there any applications
  const [stats, setStats]=useState('loading')

  const [jobTitle, setJobTitle]=useState('')
  const [workingRights, setWorkingRights]=useState([])
  const [numCandidates, setNumCandidates]=useState(0)
  const [numOffers, setNumOffers]=useState(0)
  const [numInterviews, setNumInterviews]=useState(0)
  const [qualificationsInfo, setQualificationsInfo]=useState([])
  const [numQualifications, setNumQualifications]=useState([])


	useEffect(() => {
    auth();
    axios.get(statsURL, {
      params: {
        job_id: jobID
      },
    }).then(res => {
      const stats=res.data.stats
      if (stats){setStats('true')} else {setStats('false')}
      setNumCandidates(stats.num_candidates)
      setNumOffers(stats.num_offers)
      setNumInterviews(stats.num_interviews)
      setJobTitle(stats.job_title)

      //format data in a way that charts can display
      setWorkingRights([
        {name: 'Yes', value: parseInt(stats.has_working_rights)},
        {name: 'No', value: stats.num_candidates-parseInt(stats.has_working_rights)}
      ])
      
      const dict = stats.qualifications;
      var r=[]
      for (const [key, value] of Object.entries(dict)) {
        r.push({'name':key,'Number of Candidates':parseInt(value)})
      }
      setQualificationsInfo(r)
      
      var q=[]
      const max=stats.max_qualities_met
      for(var i=0; i<=max; i++){
        q.push({'Qualifications': `${i}/${max}`, 'Number of Applicants': parseInt(stats.num_qualities_met[i]) || 0 })
      }
      console.log(q)
      setNumQualifications(q)
      setLoading(false)
      
    })
    .catch((error) => {
      console.log("error: ", error.response)
    })
		// getJobStats();		
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        if (stats){
          setStats(true)
        }
        setNumCandidates(stats.num_candidates)
        setNumOffers(stats.num_offers)
        setNumInterviews(stats.num_interviews)
        setJobTitle(stats.job_title)

        //format data in a way that charts can display
        setWorkingRights([
        {name: 'Yes', value: parseInt(stats.has_working_rights)},
        {name: 'No', value: stats.num_candidates-parseInt(stats.has_working_rights)}
       ])
         
        const dict = stats.qualifications;
        var r=[]
        for (const [key, value] of Object.entries(dict)) {
          r.push({'name':key,'Number of Candidates':parseInt(value)})
        }
        setQualificationsInfo(r)
        
        var q=[]
        const max=stats.max_qualities_met
        for(var i=0; i<=max; i++){
          q.push({'Qualifications': `${i}/${max}`, 'Number of Applicants': parseInt(stats.num_qualities_met[i]) || 0 })
        }
        console.log(q)
        setNumQualifications(q)
        setLoading(false)
        
			})
			.catch((error) => {
				console.log("error: ", error.response)
			})
    }
 
    const WorkingRights = ()=>{      
          return (
            <ResponsiveContainer width="100%" aspect={2}>
              <PieChart title='yyee' >
                <Pie data={workingRights}>
                {
                workingRights.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                }
                </Pie>
                <Tooltip formatter={(label) => (label/numCandidates)*100 + "% of applicants"}/>
                <Legend />
            </PieChart>
           </ResponsiveContainer>
        );
      }
      const qualificationsBar = ()=>{
        return qualificationsInfo.length===0? 
        (<p>No required qualifications were specified for this job.</p>):
        (
          <ResponsiveContainer width="99%" aspect={2}>
            <BarChart
            data={qualificationsInfo}
            dataKey="Number of Candidates"
            >
              <CartesianGrid  />
              <XAxis  tick={false} dataKey="name" label={{ value: 'Hover to view Qualification',position: "insideBottom"}} />
              <YAxis 
                label={{ value: "Number of Applicants", angle: -90}} 
                allowDecimals={false} />
              <Tooltip/>
              <Bar dataKey='Number of Candidates' >
              {
              qualificationsInfo.map((entry, index) => <Cell  name={entry['name']} fill={COLORS[(index+2) % COLORS.length]}/>)
              }
              </Bar>
             
              
            </BarChart>
          </ResponsiveContainer>

        )
      }

      const numberQualificationsBar = ()=>{
        return ( 
          <ResponsiveContainer width="99%" aspect={2}>
            <BarChart
            data={numQualifications}
            dataKey="Number of Applicants"
            >
              <CartesianGrid  />
              <XAxis dataKey="Qualifications" label={{ value: 'Qualifications Met',position: "insideBottom", dy: 8}} />
              <YAxis 
                label={{ value: "Number of Applicants", angle: -90}} 
                allowDecimals={false} />
              <Tooltip/>
              <Bar dataKey="Number of Applicants" fill="#f39c12"/>
            </BarChart>
          </ResponsiveContainer>
      );
    }
    
    const renderStats=()=>{
      return(
        <>
        <Typography variant="h4" style={{color: 'black', textAlign: "center",margin:20 ,marginBottom:40}}>
              {jobTitle}: Application Statistics
              </Typography>
        <Row noGutters style={{justifyContent: 'center',paddingTop:20,paddingLeft:50}}>
        <Col xs={4} >
        <div style={{display: 'block',justifyContent: 'center', marginLeft:'20%'}}>
          <Card border="primary" style={{marginBottom:20,width:'70%', height:'20%'}}>
            <Typography variant="h4" component="h2" style={{marginTop:10,marginLeft:20}}>
            {numCandidates}
            </Typography>
            <Typography variant="h8" color="textSecondary" style={{marginLeft:20 ,marginBottom:20}}>
            Applicants
            </Typography>
          </Card>
        
          <Card  border="warning" style={{marginBottom:20,width:'70%', height:'20%'}}>
            <Typography variant="h4" component="h2" style={{marginTop:10,marginLeft:20}}>
            {numInterviews}
            </Typography>
            <Typography variant="h8" color="textSecondary" style={{marginLeft:20 ,marginBottom:20}}>
            Interviews Sent
            </Typography>
          </Card>
        
          <Card border="success" style={{marginBottom:20,width:'70%', height:'20%'}}>
          <Typography variant="h4" component="h2" style={{marginTop:10,marginLeft:20}}>
            {numOffers}
            </Typography>
            <Typography variant="h8" color="textSecondary" style={{marginLeft:20 ,marginBottom:20}}>
            Offers Made
            </Typography>
          </Card>
          </div>
        </Col>
        <Col xs={8}>
          <Card style={{marginLeft:10,marginRight:30}}>
            <Card.Header as="h5" style={{"textAlign":"center"}}>Number of Qualifications Met</Card.Header>
            <Card.Body>
            {numberQualificationsBar()}
            </Card.Body>
          </Card>
        </Col>
      
      </Row>


      <Row noGutters style={{justifyContent: 'center',paddingLeft:20,paddingRight:10,paddingBottom:20,paddingTop:40}}>
        
        <Col xs={7}>
          <Card style={{marginRight:30}}>
            <Card.Header as="h5">Qualifications Breakdown</Card.Header>
            <Card.Body>
            {qualificationsBar()}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={5}>
        <Card style={{marginRight:20}}>
          <Card.Header as="h5">Applicants With Working Rights For Job Location</Card.Header>
          <Card.Body>
            {WorkingRights()}
          </Card.Body>
        </Card>
        </Col>
      </Row>
      </>)
    }
    
    return (	
      loading ? (
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)'
          }}>
          <CircularProgress/>
        </div>):
        
    (<Grid>      
        <Row noGutters fluid><TitleBar name={window.localStorage.getItem("name")}/></Row>
        <Row noGutters style={{height:'100vh',paddingTop: 60}}>
            <Col sm={2}>
                <SideMenu random={[
                   {'text':'Recruiter Dashboard','href': '/recruiterdashboard','active': false},
                   {'text': jobTitle!=='' ? (jobTitle):('Job View'),'href': '#','active': false,
                   'nested':[
                     {'text':'Applications','href': `/applications/${jobID}`,'active': false},
                     {'text':'Interviews','href': `/interviews/${jobID}`,'active': false},
                     {'text':'Offers','href': `/offers/${jobID}`,'active': false},
                     {'text': 'Statistics','href': `/jobstatistics/${jobID}`,'active': true},
                   ]},
                   {'text':'FAQ','href':'/recruiterFAQ','active': false}]}/>
            </Col >
            
            <Col sm={10}>
             
              {stats==='loading'? (
                <div style={{
                  position: 'absolute', left: '50%', top: '50%',
                  transform: 'translate(-50%, -50%)'
                  }}>
                  <CircularProgress/>
                </div>
              ) : ( stats==='true'? renderStats(): (
                <div style={{display:'flex',justifyContent:'center',marginTop:100}}>
                  There are currently no applications or statistics for this job. Check back soon!
                </div>
              ))}
              
          </Col>
        </Row>
    </Grid>)
    );
}