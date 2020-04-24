/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: Landing.jsx
 *
 * Description: This page is used as the landing page for the application if there are
 * no users logged in. It gives the user the option to login or register as either a
 * student or lecturer.
 *
 */

// Module imports
import React, { Component } from "react";
import StudentLogin from "./Student/Components/Login";
import StudentRegister from "./Student/Components/Register";
import LecturerLogin from "./Lecturer/Components/Login";
import LecturerRegister from "./Lecturer/Components/Register";

class Landing extends Component {
  // Setting up the initial state of the component.
  state = {
    studentLoginClick: true,
    studentRegisterClick: false,
    lecturerLoginClick: false,
    lecturerRegisterClick: false,
  };

  // Changing the state to reflect the option the user selects for authentication.
  handleChange = (e) => {
    if (e.target.value === "studentlogin") {
      this.setState({ studentLoginClick: true });
      this.setState({ studentRegisterClick: false });
      this.setState({ lecturerLoginClick: false });
      this.setState({ lecturerRegisterClick: false });
    } else if (e.target.value === "studentregister") {
      this.setState({ studentLoginClick: false });
      this.setState({ studentRegisterClick: true });
      this.setState({ lecturerLoginClick: false });
      this.setState({ lecturerRegisterClick: false });
    } else if (e.target.value === "lecturerlogin") {
      this.setState({ studentLoginClick: false });
      this.setState({ studentRegisterClick: false });
      this.setState({ lecturerLoginClick: true });
      this.setState({ lecturerRegisterClick: false });
    } else if (e.target.value === "lecturerregister") {
      this.setState({ studentLoginClick: false });
      this.setState({ studentRegisterClick: false });
      this.setState({ lecturerLoginClick: false });
      this.setState({ lecturerRegisterClick: true });
    }
  };

  // Rendering the page content.
  render() {
    return (
      <div>
        <nav className="blue lighten-2">
          <div className="nav-wrapper container">
            <a href="/" className="brand-logo center">
              Authenticate
            </a>
          </div>
        </nav>

        <div className="container">
          <div className="section">
            <label>Choose Authentication Option</label>
            <select
              className="browser-default"
              id="authenticationOption"
              onChange={this.handleChange}
            >
              <option value="" disabled defaultValue>
                Choose your option {this.props.loggedIn}
              </option>
              <option value="studentlogin">Student Login</option>
              <option value="studentregister">Student Register</option>
              <option value="lecturerlogin">Lecturer Login</option>
              <option value="lecturerregister">Lecturer Register</option>
            </select>
          </div>

          {this.state.studentLoginClick ? <StudentLogin /> : null}
          {this.state.studentRegisterClick ? <StudentRegister /> : null}
          {this.state.lecturerLoginClick ? <LecturerLogin /> : null}
          {this.state.lecturerRegisterClick ? <LecturerRegister /> : null}
        </div>
      </div>
    );
  }
}

export default Landing;
