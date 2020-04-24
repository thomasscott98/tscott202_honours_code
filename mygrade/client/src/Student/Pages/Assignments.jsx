/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: Assignments.jsx
 *
 * Description: This is student page that lists all of the assignments currently available to upload to. A student can
 * click on the upload button and to be redirected to the upload page - each assignment calls the assignment component to display its
 * relevant data.
 *
 */

// Module imports
import React, { Component } from "react";
import Assignment from "../Components/Assignment";

class Assignments extends Component {
  // Setting the initial state for the app.
  state = { assignments: [], message: null, messagestyle: "" };

  // Getting the assignments from the database and storing them in state.
  // If any errors, then will be shown in the message.
  componentDidMount() {
    fetch("/assignments")
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          this.setState({ assignments: response.results });
        } else {
          console.log(response.message);
        }
      })
      .catch((err) => {
        this.setState({
          message: "Cannot connnect to database. Try again later.",
          messagestyle: "red",
        });
      });
  }

  // Rendering each of the assignments in state using the Assignment component.
  render() {
    let assignments = this.state.assignments;

    return (
      <div>
        <div className="row">
          <div className="col s12">
            <h5 className="center">Assignments</h5>
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
          {assignments.map((assignment) => (
            <Assignment
              key={assignment.AssignmentID}
              id={assignment.AssignmentID}
              title={assignment.AssignmentName}
              description={assignment.AssignmentDescription}
              marksAvailable={assignment.MarksAvailable}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Assignments;
