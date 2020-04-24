/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: Assignment.jsx
 *
 * Description: This component shows the details about the assignment by using the props which are passed to it via the assignments page.
 *
 */

// Module imports
import React, { Component } from "react";
import { Link } from "react-router-dom";
import M from "materialize-css/dist/js/materialize.min.js";

class Assignment extends Component {
  state = {};

  // initialising the floating action button and tooltips.
  componentDidMount() {
    let fabtn = document.querySelectorAll(".fixed-action-btn");
    M.FloatingActionButton.init(fabtn, {});

    let tooltips = document.querySelectorAll(".tooltipped");
    M.Tooltip.init(tooltips, {});
  }

  // Rendering the assignment details.
  // Links to the upload assignment page when button clicked which allows the user
  // to upload an assignment.
  render() {
    return (
      <div style={{ paddingBottom: "10px" }} className="col s12">
        <div className="card blue darken-3">
          <div className="card-content white-text">
            <span className="card-title">{this.props.title}</span>
            <h6>Description:</h6>
            <p>{this.props.description}</p>
            <h6>Marks Available:</h6>
            <p>{this.props.marksAvailable}</p>
            <small>Click the + button to submit assignment</small>
          </div>
          <Link to={`/student/assignments/uploadassignment/${this.props.id}`}>
            <button
              className="btn-floating halfway-fab waves-effect waves-light green tooltipped"
              data-position="top"
              data-tooltip="Submit Assignment"
            >
              <i className="material-icons">add</i>
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Assignment;
