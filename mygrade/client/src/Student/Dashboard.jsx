/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: Dashboard.jsx
 *
 * Description: This page is used as the container for the student side of the application. It contains all the necessary
 * routes to parts of the app relevant to the student.
 *
 */

// Module imports
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./Components/Navbar";
import StudentHome from "./Pages/Home";
import StudentAssignments from "./Pages/Assignments";
import StudentFeedback from "./Pages/Feedback";
import StudentUploads from "./Pages/Uploads";
import StudentSettings from "./Pages/Settings";
import UploadAssignment from "./Components/UploadAssignment";
import ViewFeedback from "./Components/ViewFeedback";

class Dashboard extends Component {
  state = {};

  // Returning routes to aspects of the app.
  render() {
    return (
      <Router>
        <div>
          <Navbar />

          <div className="container" style={{ paddingBottom: "50px" }}>
            <Switch>
              <Route path="/student" exact component={StudentHome} />
              <Route
                path="/student/assignments"
                exact
                component={StudentAssignments}
              />
              <Route
                path="/student/assignments/uploadassignment/:id"
                exact
                component={UploadAssignment}
              />
              <Route
                path="/student/feedback"
                exact
                component={StudentFeedback}
              />
              <Route
                path="/student/feedback/viewfeedback/:id"
                exact
                component={ViewFeedback}
              />
              <Route path="/student/uploads" exact component={StudentUploads} />
              <Route
                path="/student/settings"
                exact
                component={StudentSettings}
              />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default Dashboard;
