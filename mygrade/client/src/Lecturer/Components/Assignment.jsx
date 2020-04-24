/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: Assignment.jsx
 *
 * Description: This component displays the individual assignment details for the assignments page.
 * It uses the props passed to it to show this data.
 *
 */

// Module imports
import React, { Component } from "react";
import M from "materialize-css/dist/js/materialize.min.js";

class Assignment extends Component {
  state = {};

  // Initialising the floating action button and tooltips
  componentDidMount() {
    let fabtn = document.querySelectorAll(".fixed-action-btn");
    M.FloatingActionButton.init(fabtn, {});

    let tooltips = document.querySelectorAll(".tooltipped");
    M.Tooltip.init(tooltips, {});
  }

  // Rendering the component to show assignment details.
  render() {
    return (
      <div style={{ paddingBottom: "10px" }} className="col s12">
        <div className="card teal darken-3">
          <div className="card-content white-text">
            <span className="card-title">{this.props.title}</span>
            <h6>Description:</h6>
            <p>{this.props.description}</p>
            <h6>Marks Available:</h6>
            <p>{this.props.marksAvailable}</p>
          </div>
          <button
            className="btn-floating halfway-fab waves-effect waves-light red tooltipped"
            data-position="top"
            data-tooltip="Delete Assignment"
            onClick={() => this.props.onDelete(this.props.id)}
          >
            <i className="material-icons">clear</i>
          </button>
        </div>
      </div>
    );
  }
}

export default Assignment;
