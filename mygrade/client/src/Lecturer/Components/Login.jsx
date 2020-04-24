/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: Login.jsx
 *
 * Description: This component is used to login a lecturer. It will take in the email and password,
 * then validate and return cookies if successful. the page will then reload, causing the app component
 * to check if the type cookie is set, thus redirecting to the lecturer dashboard.
 *
 */

// Module imports
import React, { Component } from "react";

class LecturerLogin extends Component {
  // Setting up the component state.
  state = {
    lecturerloginemail: "",
    lecturerloginpassword: "",
    message: null,
    messagestyle: "",
  };

  // Setting the state based on which input field is changed.
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // Logging the user in.
  // Validates the credentials and returns cookies if successful.
  // if there is an error then this is displayed to the user via message state.
  Login = (e) => {
    e.preventDefault();

    const { lecturerloginemail, lecturerloginpassword } = this.state;

    fetch("/lecturers/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: lecturerloginemail,
        password: lecturerloginpassword,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          window.location.reload(false);
        } else {
          this.setState({ message: response.message });
          this.setState({ messagestyle: "red" });
        }
      });
  };

  // Rendering the login component details
  render() {
    return (
      <div>
        <div className="row">
          <div className="col s12">
            <h4 className="center">Lecturer Login</h4>
          </div>
        </div>

        <div className="divider" />

        <div className="section">
          <div className="row">
            <div className="col s12">
              {this.state.message !== null ? (
                <div
                  style={{ padding: "0.5em" }}
                  className={this.state.messagestyle}
                >
                  <i className="left close material-icons">error</i>
                  {this.state.message}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <form className="col s12" onSubmit={this.Login}>
            <div className="row">
              <div className="input-field col s12 m6">
                <i className="material-icons prefix">email</i>
                <input
                  type="email"
                  name="lecturerloginemail"
                  id="lecturerloginemail"
                  placeholder="Enter Email"
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="input-field col s12 m6">
                <i className="material-icons prefix">lock</i>
                <input
                  type="password"
                  name="lecturerloginpassword"
                  id="lecturerloginpassword"
                  placeholder="Enter Password"
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>
            <div className="row">
              <button
                className="btn blue waves-effect waves-light teal col s12"
                type="submit"
                name="action"
              >
                Login
                <i className="material-icons right">send</i>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default LecturerLogin;
