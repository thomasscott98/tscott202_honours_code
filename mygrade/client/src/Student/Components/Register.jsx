/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: Register.jsx
 *
 * Description: This component is used to allow the student to register a new account. Upon successfully registering, the user is asked
 * to go to the login page and sign in.
 *
 */

// Module imports
import React, { Component } from "react";

class StudentRegister extends Component {
  // Setting the state for the component.
  state = {
    studentregisteremail: "",
    studentregisterfirstname: "",
    studentregisterlastname: "",
    studentregisterpassword: "",
    studentregisterpasswordconfirm: "",
    message: null,
    messagestyle: "",
  };

  // Changing the state based on which input field is changed.
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // Signup function calls the api to add a new student to the database.
  // On success, a message will appear telling the user to navigate to login page.
  // On failure, an appropriate message is displayed to the user.
  Signup = (e) => {
    e.preventDefault();

    const {
      studentregisteremail,
      studentregisterfirstname,
      studentregisterlastname,
      studentregisterpassword,
      studentregisterpasswordconfirm,
    } = this.state;

    fetch(
      "/students/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: studentregisteremail,
          firstname: studentregisterfirstname,
          lastname: studentregisterlastname,
          password: studentregisterpassword,
          passwordConfirm: studentregisterpasswordconfirm,
        }),
      }
    )
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          this.setState({ message: response.message });
          this.setState({ messagestyle: "green" });
        } else {
          this.setState({ message: response.message });
          this.setState({ messagestyle: "red" });
        }
      })
      .catch(() => {
        this.setState({
          message: "Cannot connect to database. Please try again later.",
        });
        this.setState({ messagestyle: "red" });
      });
  };

  // Renders the register component details.
  render() {
    return (
      <div>
        <div className="row">
          <div className="col s12">
            <h4 className="center">Student Register</h4>
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
          <form className="col s12" onSubmit={this.Signup}>
            <div className="row">
              <div className="input-field col s12 m6">
                <i className="material-icons prefix">email</i>
                <input
                  type="email"
                  name="studentregisteremail"
                  id="studentregisteremail"
                  placeholder="Enter Email"
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="input-field col s12 m6">
                <i className="material-icons prefix">person</i>
                <input
                  type="text"
                  name="studentregisterfirstname"
                  id="studentregisterfirstname"
                  placeholder="Enter First Name"
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="input-field col s12 m6">
                <i className="material-icons prefix">person</i>
                <input
                  type="text"
                  name="studentregisterlastname"
                  id="studentregisterlastname"
                  placeholder="Enter Last Name"
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="input-field col s12 m6">
                <i className="material-icons prefix">lock</i>
                <input
                  type="password"
                  name="studentregisterpassword"
                  id="studentregisterpassword"
                  placeholder="Enter Password"
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="input-field col s12">
                <i className="material-icons prefix">lock</i>
                <input
                  type="password"
                  name="studentregisterpasswordconfirm"
                  id="studentregisterpasswordconfirm"
                  placeholder="Confirm Password"
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>
            <div className="row">
              <button
                className="btn blue waves-effect waves-light col s12"
                type="submit"
                name="action"
              >
                Register
                <i className="material-icons right">send</i>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default StudentRegister;
