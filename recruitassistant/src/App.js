import React, { useState, useEffect } from 'react';
import {Router,Route} from 'react-router-dom';
import history from './History';
import Login from './Login/Login';
import SignUpRecruiter from './SignUp/SignUpRecruiter';
import SignUpJobSeeker from './SignUp/SignUpJobSeeker';
import SignUp from './SignUp/SignUp';
import RecruiterDashboard from './RecruiterComponents/RecruiterDashboard';

function App() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  return (
    <div>
      <Router history={history}>
        <Route path="/login" component={Login}/>

        <Route path="/recruiterdashboard" component={RecruiterDashboard}/>
        <Route path="/signuprecruiter" component={SignUpRecruiter}/>
        <Route path="/signupjobseeker" component={SignUpJobSeeker}/>
        <Route path="/SignUp" component={SignUp}/>
        

      </Router>
    </div>
    
  );
}

export default App;