import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect, useHistory } from 'react-router-dom';
// import history from './History';
import Login from './Authentication/Login';
import SignUpRecruiter from './Authentication/SignUpRecruiter';
import SignUpJobSeeker from './Authentication/SignUpJobSeeker';
import SignUp from './Authentication/SignUp';
import Unauthorised from './Authentication/Unauthorised';
import DashBoardTemplate from './SharedComponents/Dashboard';
import AdminDashboard from './AdminComponents/AdminDashboard';
import RecruiterDashboard from './RecruiterComponents/RecruiterDashboard';
import JobSeekerDashboard from './JobSeekerComponents/JobSeekerDashboard';
import NewJobForm from "./RecruiterComponents/NewJobForm";
import EditJob from "./RecruiterComponents/EditJob";
import Advertisement from "./JobSeekerComponents/Advertisement";
import JobApply from "./JobSeekerComponents/JobApply";
import OfferLetterForm from './RecruiterComponents/OfferLetterForm';
import ApplicationList from './RecruiterComponents/ApplicationList';
import ViewApplication from './RecruiterComponents/ViewApplication';
import Offers from './JobSeekerComponents/Offers';
import ViewOffer from './JobSeekerComponents/ViewOffer';
import RecruiterFAQ from './RecruiterComponents/RecruiterFAQ';
import JobSeekerFAQ from './JobSeekerComponents/JobSeekerFAQ';

function App() {
  // const history = useHistory();
  const [currentTime, setCurrentTime] = useState(0);


  function getSession() {
    return false // TODO: make backend call to check if there is active session
  }

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => (
            getSession() ? (
              <Redirect to="/dashboard"/>
            ) : (
              <Redirect to="/login"/>
            ))}/>
          <Route path="/login" component={Login}/>
          <Route path="/signuprecruiter" component={SignUpRecruiter}/>
          <Route path="/signupjobseeker" component={SignUpJobSeeker}/>
          <Route exact path="/signup" component={SignUp}/>
          <Route path="/unauthorised" component={Unauthorised}/>
          <Route path="/dashboard" component={DashBoardTemplate}/>
          <Route path="/admindashboard" component={AdminDashboard}/>
          <Route path="/recruiterdashboard" component={RecruiterDashboard}/>
          <Route path="/jobseekerdashboard" component={JobSeekerDashboard}/>
          <Route path="/createJobPost" component={NewJobForm}/>
          <Route path="/editjob/:jobID" component={EditJob}/>
          <Route path="/advertisement" component={Advertisement}/>
          <Route path="/jobapply" component={JobApply}/>
          <Route path="/createoffer" component={OfferLetterForm}/>
          <Route path="/applications" component={ApplicationList}/>
          <Route path="/viewapplication" component={ViewApplication}/>
          <Route path="/offers" component={Offers}/>
          <Route paty="/offer" component={ViewOffer}/>
          <Route path="/recruiterFAQ" component={RecruiterFAQ}/>
          <Route path="/jobseekerFAQ" component={JobSeekerFAQ}/>
        </Switch>
      </BrowserRouter>

    </div>
    
  );
}

export default App;