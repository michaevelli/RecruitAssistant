import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import history from './history';
import Login from './Login/Login';
import SignUpRecruiter from './SignUp/SignUpRecruiter';
import SignUpJobSeeker from './SignUp/SignUpJobSeeker';
import SignUp from './SignUp/SignUp';
import DashBoardTemplate from './SharedComponents/Dashboard';

function App() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  return (
    <div>
      <BrowserRouter history={history}>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/signuprecruiter" component={SignUpRecruiter}/>
          <Route path="/signupjobseeker" component={SignUpJobSeeker}/>
          <Route exact path="/signup" component={SignUp}/>
          <Route path="/dashboard" component={DashBoardTemplate}/>
        </Switch>
      </BrowserRouter>
    </div>
    
  );
}

export default App;