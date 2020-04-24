/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: TypeFeedback.jsx
 *
 * Description: This component is used to allow lecturers to type feedback in a textarea, convert this to a file then upload to the
 * database and S3.
 *
 */

// Module imports
import React, { Component } from "react";
import M from "materialize-css/dist/js/materialize.min.js";

class TypeFeedback extends Component {
  // Setting the state for the component. Some are set through props.
  state = {
    typedfeedback: null,
    grade: null,
    mark: null,
    lecturerid: this.props.lecturerid,
    studentid: this.props.studentid,
    assignmentid: this.props.assignmentid,
  };

  // Initialising the textarea.
  componentDidMount() {
    let textarea = document.getElementById("typedfeedback");
    M.textareaAutoResize(textarea);
  }

  // Creating the feedback, adding to database and S3.
  uploadFeedback = (e) => {
    e.preventDefault();

    let text = this.state.typedfeedback;

    // Creating a new file from the text the user entered.
    let file = new File([text], "typedfeedback.txt", { type: "text/plain" });

    let { grade, mark, lecturerid, studentid, assignmentid } = this.state;
    let newName = "";

    // Getting the file extenstion.
    const name = file.name;
    const lastDot = name.lastIndexOf(".");

    const ext = name.substring(lastDot + 1);

    // Setting the new name for the file.
    newName =
      "typedfeedback" +
      "-" +
      assignmentid +
      "-" +
      lecturerid +
      "-" +
      studentid +
      "-feedback." +
      ext;

    console.log(newName);

    // Creating form data to send to the server.
    const filedata = new FormData();
    filedata.append("file", file, newName);

    // Checks the lecturer token, creates database entry then uploads file to S3.
    // Messages will be passed back to parent and dislpayed.
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

  // Changing the state based on what the user enters into the input fields.
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Rendering the component to create new typed feedback.
  render() {
    return (
      <div className="row">
        <form className="col s12" onSubmit={this.uploadFeedback}>
          <div className="input-field col s12">
            <textarea
              name="typedfeedback"
              id="typedfeedback"
              onChange={this.handleChange}
              className="materialize-textarea"
              required
              placeholder="Enter feedback here..."
            ></textarea>
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

export default TypeFeedback;
