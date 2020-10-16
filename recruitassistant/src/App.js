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
import Advertisement from "./JobSeekerComponents/Advertisement";
import JobApply from "./JobSeekerComponents/JobApply";
import OfferLetterForm from './RecruiterComponents/OfferLetterForm';
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
          <Route path="/advertisement" component={Advertisement}/>
          <Route path="/jobapply" component={JobApply}/>
          <Route path="/createoffer" component={OfferLetterForm}/>
        </Switch>
      </BrowserRouter>

    </div>
    
  );
}

export default App;