/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: RecordVideo.jsx
 *
 * Description: Function to allow the lecturer to record a video (mobile only) or upload a video file.
 *
 */

// Module imports
import React, { Component } from "react";

class RecordVideo extends Component {
  // Setting the state for the component.
  state = {
    file: null,
    grade: null,
    mark: null,
    lecturerid: this.props.lecturerid,
    studentid: this.props.studentid,
    assignmentid: this.props.assignmentid,
  };

  // Upload the feedback to the server, database and then S3.
  uploadFeedback = (e) => {
    e.preventDefault();

    let { file, grade, mark, lecturerid, studentid, assignmentid } = this.state;
    let newName = "";

    // Getting the file extension.
    const name = file.name;
    const lastDot = name.lastIndexOf(".");

    const ext = name.substring(lastDot + 1);

    // Setting a new name for the file.
    newName =
      "feedbackvideo" +
      "-" +
      assignmentid +
      "-" +
      lecturerid +
      "-" +
      studentid +
      "-feedback." +
      ext;

    // Creating from data to send to the server.
    const filedata = new FormData();
    filedata.append("file", file, newName);

    // Checks if lecturer token is valid, then creates db entry, then uploads the file to S3.
    // Appropriate messages are shown based on success or failure.
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

  // Sets the state to the value the user enters in the respective input field.
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Setting the file state to the video recorded or the video file selected.
  // Also sets the video tag source to that of the video to let the user see the video before submitting.
  fileChange = (e) => {
    this.setState({ file: e.target.files[0] });
    let video = document.getElementById("video");
    video.src = window.URL.createObjectURL(e.target.files[0]);
  };

  // Renders the component to record a video / upload video and feedback.
  render() {
    return (
      <div className="row">
        <form className="col s12" onSubmit={this.uploadFeedback}>
          <div className="row file-field input-field">
            <button className="btn col s12 teal">
              <span>Select Video File / Record (Mobile Only)</span>
              <input
                type="file"
                name="capture"
                id="capture"
                capture
                accept="video/*"
                className="file-field input-field"
                onChange={this.fileChange}
              />
            </button>
            <div className="file-path-wrapper col s12">
              <input className="file-path validate" type="text" />
            </div>
          </div>
          <div className="row">
            <video
              src=""
              id="video"
              className="responsive-video col s12"
              controls
            ></video>
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

export default RecordVideo;
