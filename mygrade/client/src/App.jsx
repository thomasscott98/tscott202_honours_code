/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: App.jsx
 *
 * Description: This is the container for the application. When first mounted, it checks
 * the cookies to ensure a user type is set. If it is it redirects to the homepage for either
 * the student or lecturer. If theyre is no type set in cookies, it redirects to the landing page
 * for authentication.
 *
 */

// Module imports
import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Cookies from "js-cookie";
import StudentDashboard from "./Student/Dashboard";
import LecturerDashboard from "./Lecturer/Dashboard";
import Landing from "./Landing";

class App extends Component {
  // Setting component state
  state = { redirect: null };

  // Checking value of cookie to see if logged in.
  componentDidMount() {
    const type = Cookies.get("type");

    if (type === "student") {
      this.setState({ redirect: "/student" });
    } else if (type === "lecturer") {
      this.setState({ redirect: "/lecturer" });
    } else {
      this.setState({ redirect: "/landing" });
    }
  }

  // Rendering the appropriate components based on state value.
  render() {
    return (
      <Router>
        <div>
          {this.state.redirect != null ? (
            <Redirect to={this.state.redirect} />
          ) : null}

          <Switch>
            <Route path="/student" component={StudentDashboard} />
            <Route path="/lecturer" component={LecturerDashboard} />
            <Route path="/landing" component={Landing} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
