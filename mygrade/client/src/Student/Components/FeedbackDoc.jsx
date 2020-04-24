/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: FeedbackDoc.jsx
 *
 * Description: This component displays the details of a feedback item in the feedback page, it contains a link to view each
 * individual piece of feedback.
 *
 */

// Module imports
import React, { Component } from "react";
import { Link } from "react-router-dom";
import M from "materialize-css/dist/js/materialize.min.js";

class FeedbackDoc extends Component {
  // Setting the state for the component to default values and values passed through props.
  state = {
    feedbackname: this.props.feedbackname,
    studentid: this.props.studentid,
    lecturerid: this.props.lecturerid,
    assignmentid: this.props.assignmentid,
    lecturername: null,
    assignmentname: null,
  };

  // Initialising the floating action button and tooltip.
  // Calls the function to get the details about the feedback.
  componentDidMount() {
    let fabtn = document.querySelectorAll(".fixed-action-btn");
    M.FloatingActionButton.init(fabtn, {});

    let tooltips = document.querySelectorAll(".tooltipped");
    M.Tooltip.init(tooltips, {});

    this.getDetails(this.state.assignmentid, this.state.lecturerid);
  }

  // Function to call two further functions to get the assignment and lecturer details.
  getDetails = (assignmentid, lecturerid) => {
    this.getAssignmentDetails(assignmentid);
    this.getLecturerDetails(lecturerid);
  };

  //Function to get the assignment details from the database.
  getAssignmentDetails = (assignmentid) => {
    fetch(`/assignments/id/${assignmentid}`)
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          assignmentname: response.results[0].AssignmentName,
        });
      });
  };

  // Function to get the lecturer details from the database.
  getLecturerDetails = (lecturerid) => {
    fetch(`/lecturers/${lecturerid}`)
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          lecturername:
            response.results[0].FirstName + " " + response.results[0].LastName,
        });
      });
  };

  // Render the component details, with a button which links to the view feedback page.
  render() {
    let { lecturername, assignmentname, feedbackname } = this.state;
    return (
      <div style={{ paddingBottom: "10px" }} className="col s12">
        <div className="card teal darken-3">
          <div className="card-content white-text">
            <span className="card-title">{feedbackname}</span>
            <h6>Assignment Name: {assignmentname}</h6>
            <h6>Lecturer Name: {lecturername}</h6>
            <small>Click the upload button to view feedback</small>
          </div>
          <Link to={`/student/feedback/viewfeedback/${feedbackname}`}>
            <button
              className="btn-floating halfway-fab waves-effect waves-light orange tooltipped"
              data-position="top"
              data-tooltip="View Feedback"
            >
              <i className="material-icons">visibility</i>
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default FeedbackDoc;
