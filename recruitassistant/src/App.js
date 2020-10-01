import React, { useState, useEffect } from 'react';
import {Router,Route} from 'react-router-dom';
import history from './History';
import Login from './Login/Login';
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
      <p>The current time is {currentTime}.</p>
      <Router history={history}>
        <Route path="/login" component={Login}/>
        <Route path="/signUp" component={SignUp}/>
        <Route path="/dashboard" component={DashBoardTemplate}/>
      </Router>
    </div>
    
  );
}

export default App;