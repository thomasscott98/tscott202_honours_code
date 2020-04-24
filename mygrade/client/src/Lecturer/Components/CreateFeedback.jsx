/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: CreateFeedback.jsx
 *
 * Description: This component is the most complex as it allows lecturers to see a student upload, and lets them
 * decide which method of feedback to provide to the user. The user can delete the uploaded feedback and download the students
 * submitted assignment.
 *
 */

// Module imports
import React, { Component } from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import Cookies from "js-cookie";
import UploadFile from "./UploadFile";
import RecordVideo from "./RecordVideo";
import RecordAudio from "./RecordAudio";
import TypeFeedback from "./TypeFeedback";

class CreateFeedback extends Component {
  // Setting the state of the component to default values, values passed via URL and cookies.
  state = {
    uploadname: this.props.match.params.id,
    feedbackname: null,
    feedbackMethod: null,
    lecturerid: Cookies.get("lecturerid"),
    assignmentname: null,
    assignmentid: null,
    marksavailable: null,
    marksawarded: null,
    gradeawarded: null,
    studentid: null,
    studentname: null,
    studentemail: null,
    message: null,
    messagestyle: null,
    feedbackUploaded: false,
    clickUploadFile: false,
    clickRecordVideo: false,
    clickRecordAudio: false,
    clickTypeFeedback: false,
    downloadURL: null,
  };

  // Initalising the modal.
  // Getting the upload details from the upload name passed in the URL & set to state.
  componentDidMount() {
    let modal = document.querySelectorAll(".modal");
    M.Modal.init(modal, {});

    this.getUploadDetails(this.state.uploadname);
  }

  // Function to get the upload details from the database.
  // Stores values in state.
  // If successful, will get the download URL & assignment details via further functions.
  // If any errors then the appropriate error message is shown.
  getUploadDetails = (uploadname) => {
    fetch(`/uploads/name/${uploadname}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          this.setState({
            assignmentid: response.results[0].AssignmentID,
            studentid: response.results[0].StudentID,
            feedbackMethod: response.results[0].FeedbackMethod,
          });
          this.getUploadFile(uploadname);
          this.getAssignmentDetails(this.state.assignmentid);
        } else {
          this.setState({
            message: response.message,
            messagestyle: "red",
          });
        }
      })
      .catch((err) => {
        this.setState({
          message: "Cannot connect to database. Try again later.",
          messagestyle: "red",
        });
      });
  };

  // Retrieves the download URL from AWS S3 and stores in state.
  // This is used to allow the lecturer to download the student upload.
  getUploadFile = (uploadname) => {
    fetch(`/s3/downloadfile/${uploadname}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          this.setState({ downloadURL: response.downloadURL });
        }
      });
  };

  // Gets the assignment details and stores the values in state.
  // Upon success, a further function to get student details is called.
  // If there are errors, then the appropriate error message is displayed.
  getAssignmentDetails = (assignmentid) => {
    fetch(`/assignments/id/${assignmentid}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          this.setState({
            assignmentname: response.results[0].AssignmentName,
            marksavailable: response.results[0].MarksAvailable,
          });
          this.getStudentDetails(this.state.studentid);
        } else {
          this.setState({
            message: response.message,
            messagestyle: "red",
          });
        }
      })
      .catch((err) => {
        this.setState({
          message: "Cannot connect to database. Try again later.",
          messagestyle: "red",
        });
      });
  };

  // This function gets the student details and stores in state, if successful
  // then the function to check if feedback has already been uploaded is called.
  // Appropriate error messages are shown if unsuccessful.
  getStudentDetails = (studentid) => {
    fetch(`/students/${studentid}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          this.setState({
            studentname:
              response.results[0].FirstName +
              " " +
              response.results[0].LastName,
            studentemail: response.results[0].StudentEmail,
          });
          this.checkFeedbackExists();
        } else {
          this.setState({
            message: response.message,
            messagestyle: "red",
          });
        }
      })
      .catch((err) => {
        this.setState({
          message: "Cannot connect to database. Try again later.",
          messagestyle: "red",
        });
      });
  };

  // Checks to see if the feedback has already been uploaded for the student.
  // Sets values in state accordingly to represent this if true.
  checkFeedbackExists = () => {
    fetch(
      `/feedback/exists/${this.state.assignmentid}/${this.state.studentid}/${this.state.lecturerid}`
    )
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          this.setState({
            feedbackname: response.results[0].FeedbackName,
            marksawarded: response.results[0].Mark,
            gradeawarded: response.results[0].Grade,
            feedbackUploaded: true,
          });
        }
      });
  };

  // Function which is passed to child components to allow them to update messages with
  // either success or error messages.
  // Calls to check if feedback exists again to update the component.
  changeMessages = (message, style, uploaded) => {
    this.setState({
      message: message,
      messagestyle: style,
      feedbackUploaded: uploaded,
    });
    this.checkFeedbackExists();
  };

  // Determines which option the user selects for creating feedback.
  // Sets state accordingly.
  handleSelectFeedbackMethod = (e) => {
    if (e.target.value === "uploadfile") {
      this.setState({ clickUploadFile: true });
      this.setState({ clickRecordVideo: false });
      this.setState({ clickRecordAudio: false });
      this.setState({ clickTypeFeedback: false });
    } else if (e.target.value === "recordvideo") {
      this.setState({ clickUploadFile: false });
      this.setState({ clickRecordVideo: true });
      this.setState({ clickRecordAudio: false });
      this.setState({ clickTypeFeedback: false });
    } else if (e.target.value === "recordaudio") {
      this.setState({ clickUploadFile: false });
      this.setState({ clickRecordVideo: false });
      this.setState({ clickRecordAudio: true });
      this.setState({ clickTypeFeedback: false });
    } else if (e.target.value === "typefeedback") {
      this.setState({ clickUploadFile: false });
      this.setState({ clickRecordVideo: false });
      this.setState({ clickRecordAudio: false });
      this.setState({ clickTypeFeedback: true });
    }
  };

  // The select statement to be shown to the user, along with
  // conditional rendering which will display the relevant component based on which
  // type of feedback the user wants to create.
  feedbackOptions = () => (
    <div>
      <label>Choose Feedback Option</label>
      <select
        className="browser-default"
        id="feedbackOption"
        onChange={this.handleSelectFeedbackMethod}
      >
        <option value="" defaultValue>
          Choose your option
        </option>
        <option value="uploadfile">Upload File</option>
        <option value="recordvideo">Record Video</option>
        <option value="recordaudio">Record Audio</option>
        <option value="typefeedback">Type Feedback</option>
      </select>

      {this.state.clickUploadFile ? (
        <UploadFile
          studentid={this.state.studentid}
          lecturerid={this.state.lecturerid}
          assignmentid={this.state.assignmentid}
          changeMessages={this.changeMessages}
        />
      ) : null}
      {this.state.clickRecordVideo ? (
        <RecordVideo
          studentid={this.state.studentid}
          lecturerid={this.state.lecturerid}
          assignmentid={this.state.assignmentid}
          changeMessages={this.changeMessages}
        />
      ) : null}
      {this.state.clickRecordAudio ? (
        <RecordAudio
          studentid={this.state.studentid}
          lecturerid={this.state.lecturerid}
          assignmentid={this.state.assignmentid}
          changeMessages={this.changeMessages}
        />
      ) : null}
      {this.state.clickTypeFeedback ? (
        <TypeFeedback
          studentid={this.state.studentid}
          lecturerid={this.state.lecturerid}
          assignmentid={this.state.assignmentid}
          changeMessages={this.changeMessages}
        />
      ) : null}
    </div>
  );

  // Function to allow the lecturer to delete the feedback they have created.
  // User will confirm deletion via modal.
  deleteFeedback = (e) => {
    e.preventDefault();

    this.deleteS3File(this.state.feedbackname);
    this.setState({
      marksawarded: null,
      gradeawarded: null,
      feedbackUploaded: false,
    });
  };

  // Deletes the feedback from the database, sets messages accordingly.
  deleteFeedbackDB = (feedbackname) => {
    fetch("/feedback/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: feedbackname,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          this.setState({
            message: response.message,
            messagestyle: "green",
          });
        } else {
          this.setState({
            message: response.message,
            messagestyle: "red",
          });
        }
      })
      .catch((err) => {
        this.setState({
          message: "Cannot connect to database. Try again later.",
          messagestyle: "red",
        });
      });
  };

  // Deletes the feedback from the S3 store, calls to delete the feedback from the Db on success,
  // error messages show if they are encountered.
  deleteS3File = (feedbackname) => {
    fetch("/s3/deletefile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: feedbackname,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          this.deleteFeedbackDB(feedbackname);
        } else {
          this.setState({
            message: response.message,
            messagestyle: "red",
          });
        }
      })
      .catch((err) => {
        this.setState({
          message: "Cannot connect to database. Try again later.",
          messagestyle: "red",
        });
      });
  };

  // Renders the component to let the lecturer upload feedback for a subsmitted assignment.
  render() {
    let {
      uploadname,
      assignmentname,
      marksavailable,
      marksawarded,
      gradeawarded,
      studentname,
      studentemail,
      feedbackUploaded,
      feedbackMethod,
      downloadURL,
    } = this.state;

    return (
      <div>
        <div className="row">
          <div className="col s12">
            <h5 className="center">Uploaded Assignment</h5>
          </div>
        </div>

        <div className="divider" />

        <div className="row">
          <ul className="collection">
            <li className="collection-item">
              <p>Upload Name: {uploadname}</p>
              <p>Assignment Name: {assignmentname}</p>
              <p>Marks Available: {marksavailable}</p>
              <p>
                Marks Awarded:{" "}
                {marksawarded === null ? "Not marked yet" : marksawarded}
              </p>
              <p>
                Grade Awarded:{" "}
                {gradeawarded === null ? "Not marked yet" : gradeawarded}
              </p>
              <p>Preferred Feedback Method: {feedbackMethod}</p>
              <p>Student Name: {studentname}</p>
              <p className="row">
                <a href={"mailto:" + studentemail}>
                  <button className="btn teal waves-effect waves-light col s12">
                    Email Student
                    <i className="material-icons right">mail</i>
                  </button>
                </a>
              </p>
              <p className="row">
                <a href={downloadURL} download>
                  <button className="btn blue waves-effect waves-light col s12">
                    Download Upload
                    <i className="material-icons right">get_app</i>
                  </button>
                </a>
              </p>
              {feedbackUploaded === true ? (
                <p className="row">
                  <button
                    className="btn waves-effect waves-light red modal-trigger col s12"
                    data-target="deleteFeedback"
                  >
                    <i className="material-icons right">delete</i>
                    Delete Feedback
                  </button>
                </p>
              ) : null}
            </li>
          </ul>

          <div id="deleteFeedback" className="modal">
            <div className="modal-content">
              <h4>Delete Feedback?</h4>
              <p>Are you sure you would like to delete this feedback?</p>
            </div>
            <div className="modal-footer">
              <button className="modal-close left btn blue waves-effect white-text waves-blue btn-flat">
                Cancel
              </button>

              <button
                className="modal-close btn red waves-effect white-text waves-red btn-flat"
                onClick={this.deleteFeedback}
              >
                Delete
              </button>
            </div>
          </div>

          <div className="divider"></div>

          <div className="row">
            <div className="col s12">
              <h6 className="center">Create Feedback</h6>
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

            {feedbackUploaded === false ? (
              this.feedbackOptions()
            ) : (
              <div style={{ padding: "0.5em" }} className="teal">
                <i className="left close material-icons">error</i>
                You have already submitted feedback for this assignment. Please
                delete the current feedback if you want to create again.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default CreateFeedback;
