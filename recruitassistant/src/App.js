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
import Home from "./Home";
import OfferLetterForm from './RecruiterComponents/OfferLetterForm';
import CounterOffer from './JobSeekerComponents/CounterOffer';
import ApplicationList from './RecruiterComponents/ApplicationList';
import ViewApplication from './RecruiterComponents/ViewApplication';
import InterviewList from './RecruiterComponents/InterviewList';
import OfferList from './RecruiterComponents/OfferList';
import Offers from './JobSeekerComponents/Offers';
import ViewOffer from './SharedComponents/ViewOffer';
// import ViewOfferJobseeker from './JobSeekerComponents/ViewOffer';
// import ViewOfferRecruiter from './RecruiterComponents/ViewOffer';
import EditOffer from './RecruiterComponents/EditOffer';
import RecruiterFAQ from './RecruiterComponents/RecruiterFAQ';
import JobSeekerFAQ from './JobSeekerComponents/JobSeekerFAQ';
import InterviewPage from './JobSeekerComponents/InterviewPage';
import EditApplication from './JobSeekerComponents/EditApplication';
function App() {

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home}/>
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
          <Route path="/editoffer/:jobID/:appID" component={OfferLetterForm}/>
          <Route path="/counteroffer" component={CounterOffer}/> {/*test only delete after*/}
          <Route path="/applications/:jobID" component={ApplicationList}/>
          <Route path="/viewapplication/:jobID/:applicationID" component={ViewApplication}/>
          <Route path="/interviews/:jobID" component={InterviewList}/>
          <Route path="/offers/:jobID" component={OfferList}/>
          <Route path="/offers" component={Offers}/>
          <Route path="/offer/:offerID" component={ViewOffer}/>
          {/* <Route path="/offer/j/:offerID" component={ViewOfferJobseeker}/>
          <Route path="/offer/r/:jobID/:offerID" component={ViewOfferRecruiter}/> */}
          <Route path="/editoffer/:offerID" component={EditOffer}/>
          <Route path="/recruiterFAQ" component={RecruiterFAQ}/>
          <Route path="/jobseekerFAQ" component={JobSeekerFAQ}/>
          <Route path="/interview/:interviewID" component={InterviewPage}/>
          <Route path="/editApplication/:jobID/:applicationID" component={EditApplication}/>
        </Switch>
      </BrowserRouter>

    </div>
    
  );
}

export default App;