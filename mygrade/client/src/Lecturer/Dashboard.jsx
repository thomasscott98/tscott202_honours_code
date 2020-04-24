/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: Dashboard.jsx
 *
 * Description: This page is used as the container for the lecturer side of the application. It contains all the necessary
 * routes to parts of the app relevant to the lecturer.
 *
 */

// Module imports
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./Components/Navbar";
import LecturerHome from "./Pages/Home";
import LecturerAssignments from "./Pages/Assignments";
import LecturerUploads from "./Pages/Uploads";
import LecturerSettings from "./Pages/Settings";
import CreateFeedback from "./Components/CreateFeedback";

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
              <Route path="/lecturer" exact component={LecturerHome} />
              <Route
                path="/lecturer/assignments"
                exact
                component={LecturerAssignments}
              />
              <Route
                path="/lecturer/uploads"
                exact
                component={LecturerUploads}
              />
              <Route
                path="/lecturer/uploads/createfeedback/:id"
                exact
                component={CreateFeedback}
              />
              <Route
                path="/lecturer/settings"
                exact
                component={LecturerSettings}
              />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default Dashboard;
