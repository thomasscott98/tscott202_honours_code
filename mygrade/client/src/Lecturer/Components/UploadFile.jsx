/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: UploadFile.jsx
 *
 * Description: This component is used for the lecturer to upload a feedback document to the database and S3 store.
 *
 */

// Module imports
import React, { Component } from "react";

class UploadFile extends Component {
  // Setting the state for the component.
  state = {
    file: null,
    grade: null,
    mark: null,
    lecturerid: this.props.lecturerid,
    studentid: this.props.studentid,
    assignmentid: this.props.assignmentid,
  };

  // Setting the file state to the file the user selects.
  fileChange = (e) => {
    this.setState({ file: e.target.files[0] });
  };

  // Changing the state based on the info entered in the input fields.
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Uploading the file to the S3 store and saving to database.
  // If there are any issues then appropriate error messages are shown.
  uploadFeedback = (e) => {
    e.preventDefault();

    let { file, grade, mark, lecturerid, studentid, assignmentid } = this.state;
    let newName = "";

    // Getting the file name and separating the name from the extension type.
    const name = file.name;
    const lastDot = name.lastIndexOf(".");

    const fileName = name.substring(0, lastDot);
    const ext = name.substring(lastDot + 1);

    // Setting a new name for the file.
    newName =
      fileName +
      "-" +
      assignmentid +
      "-" +
      lecturerid +
      "-" +
      studentid +
      "-feedback." +
      ext;

    console.log(newName);

    // Creating form data to send to the server with the file and its new name.
    const filedata = new FormData();
    filedata.append("file", file, newName);

    // Validates lecturer is logged in then adds details to the databse, if this is successful it then adds the file to S3.
    // Messages passed back to parent component and displayed.
    fetch("/checktokenlecturer").then((response) => {
      if (response.status === 200) {
        this.props.changeMessages(
          "Uploading File... Please Wait",
          "teal",
          false
        );
        fetch("/feedback/createfeedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            feedbackname: newName,
            grade: grade,
            mark: mark,
            studentid: studentid,
            assignmentid: assignmentid,
            lecturerid: lecturerid,
          }),
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.success) {
              fetch("/s3/uploadfile", {
                method: "POST",
                body: filedata,
              })
                .then((res) => res.json())
                .then((response) => {
                  if (response.success === true) {
                    this.props.changeMessages(response.message, "green", true);
                  } else {
                    this.props.changeMessages(response.message, "red", false);
                  }
                });
            } else {
              this.props.changeMessages(response.message, "red", false);
            }
          });
      } else {
        this.props.changeMessages(response.message, "red", false);
      }
    });
  };

  // Rendering the component details.
  render() {
    return (
      <div className="row">
        <form className="col s12" onSubmit={this.uploadFeedback}>
          <div className="row file-field input-field">
            <button className="btn col s12 teal">
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
            <div className="input-field col s12">
              <input
                id="mark"
                name="mark"
                type="text"
                className="validate"
                required
                onChange={this.handleChange}
              />
              <label htmlFor="mark">Mark</label>
            </div>
            <div className="input-field col s12">
              <input
                id="grade"
                name="grade"
                type="text"
                className="validate"
                required
                onChange={this.handleChange}
              />
              <label htmlFor="grade">Grade</label>
            </div>
          </div>
          <div className="row">
            <button
              className="btn teal waves-effect waves-light col s12"
              type="submit"
              name="upload"
            >
              Upload Feedback
              <i className="material-icons right">publish</i>
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default UploadFile;
