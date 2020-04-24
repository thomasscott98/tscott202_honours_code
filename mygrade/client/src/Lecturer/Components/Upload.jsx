/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: Upload.jsx
 *
 * Description: Displays each individual upload and gives the lecturer the option to click
 * a button to upload feedback. This button redirects to the create feedback page.
 *
 */

// Module imports
import React, { Component } from "react";
import { Link } from "react-router-dom";
import M from "materialize-css/dist/js/materialize.min.js";

class Upload extends Component {
  // Setting the state of the component. Some values are passed through props.
  state = {
    studentid: this.props.studentid,
    assignmentid: this.props.assignmentid,
    uploadname: this.props.name,
    lecturerid: null,
    assignmentname: null,
    studentname: null,
  };

  // Initialises the floating action button and tooltips.
  // Also calls the get details function to get assignment and student details.
  componentDidMount() {
    let fabtn = document.querySelectorAll(".fixed-action-btn");
    M.FloatingActionButton.init(fabtn, {});

    let tooltips = document.querySelectorAll(".tooltipped");
    M.Tooltip.init(tooltips, {});

    this.getDetails(this.state.assignmentid, this.state.studentid);
  }

  // Calls the functions to get assignment details and student details.
  getDetails = (assignmentid, studentid) => {
    this.getAssignmentDetails(assignmentid);
    this.getStudentDetails(studentid);
  };

  // Function gets assignment details and stores value in state.
  getAssignmentDetails = (assignmentid) => {
    fetch(`/assignments/id/${assignmentid}`)
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          assignmentname: response.results[0].AssignmentName,
        });
      });
  };

  // Gets the student details and stores the name in state.
  getStudentDetails = (studentid) => {
    fetch(`/students/${studentid}`)
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          studentname:
            response.results[0].FirstName + " " + response.results[0].LastName,
        });
      });
  };

  // Renders the component showing each uploads details with a button to create feedback.
  render() {
    let { studentname, assignmentname, uploadname } = this.state;

    return (
      <div style={{ paddingBottom: "10px" }} className="col s12">
        <div className="card teal darken-3">
          <div className="card-content white-text">
            <span className="card-title">{uploadname}</span>
            <h6>Assignment Name: {assignmentname}</h6>
            <h6>Student Name: {studentname}</h6>
            <small>Click the upload button to create feedback</small>
          </div>
          <Link to={`/lecturer/uploads/createfeedback/${uploadname}`}>
            <button
              className="btn-floating halfway-fab waves-effect waves-light orange tooltipped"
              data-position="top"
              data-tooltip="Create Feedback"
            >
              <i className="material-icons">cloud_upload</i>
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Upload;
