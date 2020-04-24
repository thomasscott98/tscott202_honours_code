/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: Upload.jsx
 *
 * Description: This component is used to display each upload to the user. It has a button which calls the parent component
 * delete function to delete the upload.
 *
 */

// Module imports
import React, { Component } from "react";
import M from "materialize-css/dist/js/materialize.min.js";

class Upload extends Component {
  // Setting the state for the component using default values and the props.
  state = {
    AssignmentID: this.props.AssignmentID,
    AssignmentName: null,
    LecturerID: null,
    LecturerName: null,
  };

  // Initialising the floating action button and tooltips.
  // Getting the assignment and lecturer details for the current upload document.
  componentDidMount() {
    var fabtn = document.querySelectorAll(".fixed-action-btn");
    M.FloatingActionButton.init(fabtn, {});

    var tooltips = document.querySelectorAll(".tooltipped");
    M.Tooltip.init(tooltips, {});

    this.getAssignmentDetails();
  }

  // Gets the assignment details and the lecturer details for the assignment.
  // Stores the values in state.
  getAssignmentDetails = () => {
    fetch(
      `/assignments/id/${this.state.AssignmentID}`
    )
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          AssignmentName: response.results[0].AssignmentName,
          LecturerID: response.results[0].LecturerID,
        });
        fetch(`/lecturers/${this.state.LecturerID}`)
          .then((res) => res.json())
          .then((response) => {
            this.setState({
              LecturerName:
                response.results[0].FirstName +
                " " +
                response.results[0].LastName,
            });
          });
      });
  };

  // Rendering the component details. Has a button which calls the parent components delete function to delete the upload.
  render() {
    return (
      <div style={{ paddingBottom: "10px" }} className="col s12">
        <div className="card blue darken-3">
          <div className="card-content white-text">
            <span className="card-title">
              Assignment Name: {this.state.AssignmentName}
            </span>
            <h6>Upload Name: {this.props.UploadName}</h6>
            <h6>Lecturer Name: {this.state.LecturerName}</h6>
            <small>Click the X button to delete this upload</small>
          </div>
          <button
            className="btn-floating halfway-fab waves-effect waves-light red tooltipped"
            data-position="top"
            data-tooltip="Delete Assignment"
            onClick={() => this.props.onDelete(this.props.UploadName)}
          >
            <i className="material-icons">clear</i>
          </button>
        </div>
      </div>
    );
  }
}

export default Upload;
