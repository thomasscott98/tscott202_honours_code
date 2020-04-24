/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: RecordAudio.jsx
 *
 * Description: Function to allow the lecturer to record a audio (mobile only) or upload a audio file.
 *
 */

// Module imports
import React, { Component } from "react";

class RecordAudio extends Component {
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

    // Setting a new name for the file.
    newName =
      "feedbackaudio" +
      "-" +
      assignmentid +
      "-" +
      lecturerid +
      "-" +
      studentid +
      "-feedback." +
      "mp3";

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

  // Setting the file state to the audio recorded or the audio file selected.
  // Also sets the audio tag source to that of the audio to let the user see the audio before submitting.
  fileChange = (e) => {
    this.setState({ file: e.target.files[0] });
    let audio = document.getElementById("audio");
    audio.src = window.URL.createObjectURL(e.target.files[0]);
  };

  // Renders the component to record audio / upload audio and feedback.
  render() {
    return (
      <div className="row">
        <form className="col s12" onSubmit={this.uploadFeedback}>
          <div className="row file-field input-field">
            <button className="btn col s12 teal">
              <span>Select Audio File / Record (Mobile Only)</span>
              <input
                type="file"
                name="capture"
                id="capture"
                capture
                accept="audio/*"
                className="file-field input-field"
                onChange={this.fileChange}
              />
            </button>
            <div className="file-path-wrapper col s12">
              <input className="file-path validate" type="text" />
            </div>
          </div>
          <div className="row">
            <audio src="" id="audio" className="col s12" controls></audio>
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

export default RecordAudio;
