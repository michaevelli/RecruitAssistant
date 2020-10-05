import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect, useHistory } from 'react-router-dom';
// import history from './History';
import Login from './Login/Login';
import SignUpRecruiter from './SignUp/SignUpRecruiter';
import SignUpJobSeeker from './SignUp/SignUpJobSeeker';
import SignUp from './SignUp/SignUp';
import DashBoardTemplate from './SharedComponents/Dashboard';
import AdminDashboard from './AdminComponents/AdminDashboard';
import RecruiterDashboard from './RecruiterComponents/RecruiterDashboard';
import JobSeekerDashboard from './JobSeekerComponents/JobSeekerDashboard';

function App() {
  // const history = useHistory();
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

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
          <Route path="/dashboard" component={DashBoardTemplate}/>
          <Route path="/admindashboard" component={AdminDashboard}/>
          <Route path="/recruiterdashboard" component={RecruiterDashboard}/>
          <Route path="/jobseekerdashboard" component={JobSeekerDashboard}/>
        </Switch>
      </BrowserRouter>

    </div>
    
  );
}

export default App;