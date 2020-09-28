import React from 'react';
import {Router,Route} from 'react-router-dom';
import history from './History';
import Login from './Login/Login';


function App() {
  return (
    <div>
      <div>home page</div>
      <Router history={history}>
        <Route path="/login" component={Login}/>
      </Router>
    </div>
    
  );
}

export default App;
