/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: ViewFeedback.jsx
 *
 * Description: This component is used to display the feedback which has been provided by the lecturer.
 *
 */

// Module imports
import React, { Component } from "react";

class ViewFeedback extends Component {
  // Sets the state for the component.
  state = {
    feedbackname: this.props.match.params.id,
    studentid: null,
    assignmentid: null,
    assignmentname: null,
    marksavailable: null,
    marksawarded: null,
    gradeawarded: null,
    lecturerid: null,
    lecturername: null,
    lectureremail: null,
    hidemarks: true,
    hidegrade: true,
    downloadURL: null,
  };

  // Calls a function to get the feedback details.
  componentDidMount() {
    this.getFeedbackDetails(this.state.feedbackname);
  }

  // Function to get the feedback details for a specifc piece of feedback.
  // On success, further methods are called to get more details.
  getFeedbackDetails = (feedbackname) => {
    fetch(`/feedback/feedbackname/${feedbackname}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          this.setState({
            marksawarded: response.results[0].Mark,
            gradeawarded: response.results[0].Grade,
            assignmentid: response.results[0].AssignmentID,
            lecturerid: response.results[0].LecturerID,
            studentid: response.results[0].StudentID,
          });
          this.getFeedbackFile(this.state.feedbackname);
          this.getLecturerDetails(this.state.lecturerid);
          this.getAssignmentDetails(this.state.assignmentid);
          this.getUploadDetails(this.state.assignmentid, this.state.studentid);
        }
      });
  };

  // Gets the download URL from the S3 store.
  // Stores in state.
  getFeedbackFile = (feedbackname) => {
    fetch(`/s3/downloadfile/${feedbackname}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          this.setState({ downloadURL: response.downloadURL });
        }
      });
  };

  // This function checks the type of feedback receieved.
  // If the type is mp3 or mp4, the feedback will display to the user.
  // Otherwise, the user is instructed to download the feedback instead.
  displayFeedback = () => {
    let { feedbackname, downloadURL } = this.state;

    const lastDot = feedbackname.lastIndexOf(".");
    const ext = feedbackname.substring(lastDot + 1);

    let display = null;

    if (ext === "mp4") {
      display = (
        <video
          className="responsive-video col s12"
          src={downloadURL}
          controls
        ></video>
      );
    } else if (ext === "mp3") {
      display = <audio className="col s12" src={downloadURL} controls></audio>;
    } else {
      display = (
        <div style={{ padding: "0.5em" }} className="red">
          <i className="left close material-icons">error</i>
          This feedback cannot be viewed in-app. Please download instead.
        </div>
      );
    }
    return display;
  };

  // Function to get the lecturer details and store in state.
  getLecturerDetails = (lecturerid) => {
    fetch(`/lecturers/${lecturerid}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          this.setState({
            lecturername:
              response.results[0].FirstName +
              " " +
              response.results[0].LastName,
            lectureremail: response.results[0].LecturerEmail,
          });
        }
      });
  };

  // Function to get the assignment details and store in state.
  getAssignmentDetails = (assignmentid) => {
    fetch(`/assignments/id/${assignmentid}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          this.setState({
            assignmentname: response.results[0].AssignmentName,
            marksavailable: response.results[0].MarksAvailable,
          });
        }
      });
  };

  // Checking to see if the student chose to hide marks and grade from the feedback.
  // Sets the state accordingly.
  getUploadDetails = (assignmentid, studentid) => {
    fetch(`/uploads/checkexists/${assignmentid}/${studentid}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          let checkHide = response.results[0].HideMarks;
          if (checkHide === "true") {
            this.setState({ hidegrade: true, hidemarks: true });
          } else {
            this.setState({ hidegrade: false, hidemarks: false });
          }
        }
      });
  };

  // Function to alternate between hiding and showing the mark and grades of an assignment based on button click.
  revealGrades = (e) => {
    this.setState({
      hidegrade: !this.state.hidegrade,
      hidemarks: !this.state.hidemarks,
    });
  };

  // Rendering the component details to the user.
  render() {
    let {
      feedbackname,
      assignmentname,
      marksavailable,
      marksawarded,
      gradeawarded,
      lecturername,
      lectureremail,
      hidemarks,
      hidegrade,
      downloadURL,
    } = this.state;

    return (
      <div>
        <div className="row">
          <div className="col s12">
            <h5 className="center">Assignment Feedback</h5>
          </div>
        </div>

        <div className="divider" />

        <div className="row">
          <ul className="collection">
            <li className="collection-item">
              <p>Feedback Name: {feedbackname}</p>
              <p>Assignment Name: {assignmentname}</p>
              <p>Marks Available: {marksavailable}</p>
              <p>
                Grade Awarded:{" "}
                {hidegrade === true ? "Grade Hidden" : gradeawarded}
              </p>
              <p>
                Marks Awarded:{" "}
                {hidemarks === true ? "Marks Hidden" : marksawarded}
              </p>
              <p>Lecturer Name: {lecturername}</p>
              <p className="row">
                <a href={"mailto:" + lectureremail}>
                  <button className="btn teal waves-effect waves-light col s12">
                    Email Lecturer
                    <i className="material-icons right">mail</i>
                  </button>
                </a>
              </p>
              <p className="row">
                <button
                  className="btn orange waves-effect waves-light col s12"
                  onClick={this.revealGrades}
                >
                  Reveal/Hide Grade and Mark
                  <i className="material-icons right">visibility</i>
                </button>
              </p>
              <p className="row">
                <a href={downloadURL} download>
                  <button className="btn blue waves-effect waves-light col s12">
                    Download Feedback
                    <i className="material-icons right">get_app</i>
                  </button>
                </a>
              </p>
            </li>
          </ul>

          <div className="divider"></div>

          <div className="row">
            <div className="col s12">
              <h5 className="center">View Feedback</h5>
            </div>
          </div>
          <div className="row">
            <div className="col s12">{this.displayFeedback()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewFeedback;
