/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: UploadAssignment.jsx
 *
 * Description: This component is used upload a file for an assignment. If a user has already submitted
 * then they cannot upload again until they delete the relevant upload.
 *
 */

// Module imports
import React, { Component } from "react";
import Cookies from "js-cookie";

class UploadAssignment extends Component {
  // Setting the state for the component, using default values and getting the cookies.
  state = {
    assignment: [],
    lecturer: [],
    studentID: Cookies.get("studentid"),
    file: null,
    feedbackMethod: "written",
    isChecked: false,
    message: null,
    messagestyle: "",
    ifUploaded: false,
  };

  // Calls function to get the data for the assignment when the component mounts.
  componentDidMount() {
    this.getAssignmentData();
  }

  // Function gets assignment and lecturer details and storing in state.
  // Also checks if the user has uploaded for this assignment already and setting the state accordingly.
  getAssignmentData = () => {
    fetch(`/assignments/id/${this.props.match.params.id}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          this.setState({ assignment: response.results[0] });
          fetch(`/lecturers/${this.state.assignment.LecturerID}`)
            .then((res) => res.json())
            .then((response) => {
              if (response.success) {
                this.setState({ lecturer: response.results[0] });
                let { AssignmentID } = this.state.assignment;
                let StudentID = this.state.studentID;
                fetch(`/uploads/checkexists/${AssignmentID}/${StudentID}`)
                  .then((res) => res.json())
                  .then((response) => {
                    if (response.success === true) {
                      this.setState({ ifUploaded: true });
                    } else {
                      this.setState({ ifUploaded: false });
                    }
                  });
              }
            });
        }
      });
  };

  // Uploading the file to the S3 store and saving to database.
  // If there are any issues then appropriate error messages are shown.
  uploadAssignment = (e) => {
    e.preventDefault();

    let { file } = this.state;
    let { AssignmentID } = this.state.assignment;
    let { LecturerID } = this.state.lecturer;
    let StudentID = this.state.studentID;
    let hidemarks = "false";
    let feedbackMethod = this.state.feedbackMethod;
    let newName = "";

    if (this.state.isChecked === true) {
      hidemarks = "true";
    } else {
      hidemarks = "false";
    }

    // Getting the file name and separating the name from the extension type.
    const name = file.name;
    const lastDot = name.lastIndexOf(".");

    const fileName = name.substring(0, lastDot);
    const ext = name.substring(lastDot + 1);

    // Setting a new name for the file.
    newName =
      fileName +
      "-" +
      AssignmentID +
      "-" +
      LecturerID +
      "-" +
      StudentID +
      "-upload." +
      ext;

    // Creating form data to send to the server with the file and its new name.
    const filedata = new FormData();
    filedata.append("file", file, newName);

    // Validates student is logged in then uploads to s3, if this is successful it then adds the details to the database.
    fetch("/checktokenstudent").then((response) => {
      if (response.status === 200) {
        this.setState({
          message: "Uploading file....",
          messagestyle: "orange",
        });
        fetch("/s3/uploadfile", {
          method: "POST",
          body: filedata,
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.success === true) {
              fetch("/uploads/createupload", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify({
                  uploadname: newName,
                  studentid: StudentID,
                  assignmentid: AssignmentID,
                  feedbackmethod: feedbackMethod,
                  hidemarks: hidemarks,
                }),
              })
                .then((res) => res.json())
                .then((response) => {
                  if (response.success) {
                    this.setState({
                      message: response.message,
                      messagestyle: "green",
                      ifUploaded: true,
                    });
                  } else {
                    this.setState({
                      message: response.message,
                      messagestyle: "red",
                    });
                  }
                });
            } else {
              this.setState({ message: response.message, messagestyle: "red" });
            }
          });
      } else {
        this.setState({ message: response.message, messagestyle: "red" });
      }
    });
  };

  // Setting the file to the file the user selects.
  fileChange = (e) => {
    this.setState({
      file: e.target.files[0],
    });
  };

  // Changing the state if the checkbox to keep marks separate from feedback is ticked.
  toggleChange = () => {
    this.setState({ isChecked: !this.state.isChecked });
  };

  // Changes the state feedbackmethod based on which item from the select list is chosen.
  changeFeedbackMethod = (e) => {
    if (e.target.value === "written") {
      this.setState({ feedbackMethod: "written" });
    } else if (e.target.value === "audio") {
      this.setState({ feedbackMethod: "audio" });
    } else if (e.target.value === "video") {
      this.setState({ feedbackMethod: "video" });
    }
  };

  // Rendering the component details to upload an assessment.
  render() {
    let {
      AssignmentName,
      AssignmentDescription,
      MarksAvailable,
    } = this.state.assignment;

    let { LecturerEmail, FirstName, LastName } = this.state.lecturer;

    return (
      <div>
        <div className="row">
          <div className="col s12">
            <h5 className="center">Upload Assignment</h5>
          </div>
        </div>

        <div className="divider" />

        <div className="row">
          <ul className="collection">
            <li className="collection-item">
              <span className="title">Assignment Details</span>
              <p>Assignment Name: {AssignmentName}</p>
              <p>Assignment Description: {AssignmentDescription}</p>
              <p>Marks Available: {MarksAvailable}</p>
              <p>
                Lecturer Name: {FirstName} {LastName}
              </p>
              <p className="row">
                <a href={"mailto:" + LecturerEmail}>
                  <button className="btn teal waves-effect waves-light col s12">
                    Email Lecturer
                    <i className="material-icons right">mail</i>
                  </button>
                </a>
              </p>
            </li>
          </ul>

          <div className="divider"></div>

          <div className="row">
            <div className="col s12">
              <h6 className="center">Upload Assignment</h6>
            </div>

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

            {this.state.ifUploaded === true ? (
              <div style={{ padding: "0.5em" }} className="teal">
                <i className="left close material-icons">error</i>
                You have already submitted this assignment. Please go to Uploads
                page to delete before resubmitting.
              </div>
            ) : (
              <div className="row">
                <form className="col s12" onSubmit={this.uploadAssignment}>
                  <div className="row file-field input-field">
                    <button className="btn col s12 blue">
                      <span>Select File</span>
                      <input
                        name="file"
                        type="file"
                        required
                        onChange={this.fileChange}
                      />
                    </button>
                    <div className="file-path-wrapper col s12">
                      <input className="file-path validate" type="text" />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s12">
                      <label>Prefered Feedback Method</label>
                      <select
                        className="browser-default"
                        id="feedbackMethod"
                        onChange={this.changeFeedbackMethod}
                        required
                      >
                        <option value="" disabled defaultValue>
                          Choose your option
                        </option>
                        <option value="written">Written</option>
                        <option value="audio">Audio</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div className="col s12 center">
                      <p>
                        <label>
                          <input
                            name="hidemarks"
                            id="indeterminate-checkbox"
                            type="checkbox"
                            onChange={this.toggleChange}
                          />
                          <span>
                            Would you like to hide your mark when feedback is
                            receieved?
                          </span>
                        </label>
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <button
                      className="btn blue waves-effect waves-light col s12"
                      type="submit"
                      name="upload"
                    >
                      Upload Assignment
                      <i className="material-icons right">publish</i>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default UploadAssignment;
