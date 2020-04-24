/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: Assignments.jsx
 *
 * Description: This page shows all of the assignments that a lecturer has created. It
 * also lets the user create a new assignment via a modal dialog box. It calls the Assignmnet
 * component to display individual assignment details.
 *
 */

// Module imports
import React, { Component } from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import Assignment from "../Components/Assignment";
import Cookies from "js-cookie";

class Assignments extends Component {
  // Setting up the state for the component.
  state = {
    assignments: [],
    lecturerID: Cookies.get("lecturerid"),
    message: null,
    messagestyle: "",
    assignmentname: "",
    assignmentdescription: "",
    assignmentmarks: "",
  };

  // Setting the state to the value of the corresponding input field.
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  /**
   * Function to create a new assignment in the database.
   * Gets the values needed from the state then makes a POST fetch
   * request to the server to add the details.
   * If the creation is successful, a success message shows and the
   * get assignments function is called to update the component.
   * If it fails then an appropriate error message is shown.
   */
  createAssignment = (e) => {
    e.preventDefault();
    const {
      assignmentname,
      assignmentdescription,
      assignmentmarks,
      lecturerID,
    } = this.state;

    fetch("/assignments/createassignment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        assignmentname: assignmentname,
        assignmentdescription: assignmentdescription,
        marksavailable: assignmentmarks,
        lecturerid: lecturerID,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          this.setState({ message: response.message });
          this.setState({ messagestyle: "green" });
          this.getAssignments();
        } else {
          this.setState({ message: response.message });
          this.setState({ messagestyle: "red" });
        }
      })
      .catch(() => {
        this.setState({
          modalmessage: "Cannot connect to database. Please try again later.",
        });
        this.setState({ messagestyle: "red" });
      });
  };

  /**
   * Initialising the modal and textarea for the component.
   * Calling the get assignments function to retreive the assignments upon
   * the component mounting.
   */
  componentDidMount() {
    let modal = document.querySelectorAll(".modal");
    M.Modal.init(modal, {});

    let textarea = document.getElementById("assignmentdescription");
    M.textareaAutoResize(textarea);

    this.getAssignments();
  }

  /**
   * Function with a fetch request to retreive the assignments.
   * On success the assignments are stored in state.
   * If failure then the appropriate message is shown.
   */
  getAssignments = () => {
    fetch(`/assignments/lecturerid/${this.state.lecturerID}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          this.setState({ assignments: response.results });
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

  /**
   * Function used to delete an assignment.
   * Makes several fetch POST requests.
   * Will delete ALL uploads. on success will then delete ALL feedback,
   * and then finally will delete the assignment itself.
   * On successful deletion the assignments are fetched again to reflect
   * this to the user in the UI.
   * On error the appropriate message is shown.
   */
  onDelete = (assignmentid) => {
    fetch(`/uploads/deleteall`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        assignmentid: assignmentid,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        fetch(`/feedback/deleteall`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            assignmentid: assignmentid,
          }),
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.success === true) {
              fetch(`/assignments/delete`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify({
                  id: assignmentid,
                }),
              })
                .then((res) => res.json())
                .then((response) => {
                  if (response.success === true) {
                    this.setState({ message: response.message });
                    this.setState({ messagestyle: "green" });
                    this.getAssignments();
                  } else {
                    this.setState({ message: response.message });
                    this.setState({ messagestyle: "red" });
                  }
                })
                .catch((err) => {
                  this.setState({
                    message: "Cannot connect to database. Try again later.",
                  });
                  this.setState({ messagestyle: "red" });
                });
            } else {
              this.setState({ message: response.message });
              this.setState({ messagestyle: "red" });
            }
          })
          .catch((err) => {
            this.setState({
              message: "Cannot connect to database. Try again later.",
            });
            this.setState({ messagestyle: "red" });
          });
      })
      .catch((err) => {
        this.setState({
          message: "Cannot connect to database. Try again later.",
        });
        this.setState({ messagestyle: "red" });
      });
  };

  /**
   * Rendering the component to the user.
   * Sets up a modal to creat an assignment.
   * Maps out the assignments as stored in the state, whereby each assignment will
   * call the individual assignment component to display its details.
   */
  render() {
    let assignments = this.state.assignments;
    return (
      <div>
        <div className="row">
          <div className="col s12">
            <h5 className="center">Assignments</h5>
          </div>
        </div>

        <div className="row">
          <div className="col s12 center">
            <button
              data-target="createassignment"
              className="btn modal-trigger"
            >
              Create Assignment
            </button>
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
              onDelete={this.onDelete}
            />
          ))}
        </div>

        <div id="createassignment" className="modal">
          <div className="modal-content">
            <h4 className="center">Create Assignment</h4>
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
              <form className="col s12" onSubmit={this.createAssignment}>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      type="text"
                      name="assignmentname"
                      id="assignmentname"
                      onChange={this.handleChange}
                      required
                    />
                    <label htmlFor="assignmentname">Assignment Name</label>
                  </div>
                  <div className="input-field col s12">
                    <textarea
                      name="assignmentdescription"
                      id="assignmentdescription"
                      onChange={this.handleChange}
                      className="materialize-textarea"
                      required
                    ></textarea>
                    <label htmlFor="assignmentdescription">
                      Assignment Description
                    </label>
                  </div>
                  <div className="input-field col s12">
                    <input
                      type="number"
                      name="assignmentmarks"
                      id="assignmentmarks"
                      onChange={this.handleChange}
                      required
                    />
                    <label htmlFor="marksavailable">Marks Available</label>
                  </div>
                </div>
                <div className="row">
                  <button
                    className="btn teal waves-effect waves-light col s12"
                    type="submit"
                    name="createbutton"
                  >
                    Create Assignment
                    <i className="material-icons right">create</i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Assignments;
