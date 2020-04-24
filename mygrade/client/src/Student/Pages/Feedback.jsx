/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: Feedback.jsx
 *
 * Description: This page shows the feedback which is available for viewing by a student. The user can click to view the feedback.
 *
 */

// Module imports
import React, { Component } from "react";
import Cookies from "js-cookie";
import FeedbackDoc from "../Components/FeedbackDoc";

class Feedback extends Component {
  // Setting up the state for the component.
  state = {
    feedback: [],
    studentid: Cookies.get("studentid"),
    message: null,
    messagestyle: null,
  };

  // Calls the method to get the feedback upon component mounting.
  componentDidMount() {
    this.getFeedbackDocs(this.state.studentid);
  }

  // Function to get the feedback for the user who is logged in.
  // If there is no connection, error displays.
  getFeedbackDocs = (studentid) => {
    fetch(
      `/feedback/studentid/${studentid}`
    )
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          this.setState({ feedback: response.results });
        } else {
          this.setState({ message: response.message, messagestyle: "red" });
        }
      })
      .catch((err) => {
        this.setState({
          message: "Cannot connect to database. Try again later.",
          messagestyle: "red",
        });
      });
  };

  // Rendering the component details and the feedback available for viewing.
  render() {
    let { feedback } = this.state;

    return (
      <div>
        <div className="row">
          <div className="col s12">
            <h5 className="center">Feedback</h5>
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
              ) : null}
            </div>
          </div>
        </div>

        <div className="row">
          {feedback.map((feedbackdoc) => (
            <FeedbackDoc
              key={feedbackdoc.FeedbackName}
              feedbackname={feedbackdoc.FeedbackName}
              studentid={feedbackdoc.StudentID}
              assignmentid={feedbackdoc.AssignmentID}
              lecturerid={feedbackdoc.LecturerID}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Feedback;
