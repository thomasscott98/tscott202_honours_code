/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: Uploads.jsx
 *
 * Description: This page shows all the uploads the logged in user has made. It allows them to delete thier uploads.
 *
 */

// Module imports
import React, { Component } from "react";
import Cookies from "js-cookie";
import M from "materialize-css/dist/js/materialize.min.js";
import Upload from "../Components/Upload";

class StudentUploads extends Component {
  // Setting up the state for the component.
  state = {
    uploads: [],
    message: "",
    messagestyle: "",
    studentid: Cookies.get("studentid"),
  };

  // Initialising the floating action button and tooltips.
  // Getting the uploads for the student upon component mounting.
  componentDidMount() {
    var fabtn = document.querySelectorAll(".btn-floating");
    M.FloatingActionButton.init(fabtn, {});

    var tooltips = document.querySelectorAll(".tooltipped");
    M.Tooltip.init(tooltips, {});

    this.getUploads();
  }

  // Get the uploads relevant to the logged in user.
  // Stores the uploads in the state.
  // Failure message if not successful.
  getUploads = () => {
    fetch(`/uploads/studentid/${this.state.studentid}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          this.setState({ uploads: response.results });
        } else {
          this.setState({ message: response.message, messagestyle: "red" });
        }
      })
      .catch((err) => {
        this.setState({
          message: "Cannot connnect to database. Try again later.",
          messagestyle: "red",
        });
      });
  };

  // Function to get the assignment name from the database.
  // Not used but kept incase it is necessary.
  // Logs to console.
  getAssignmentName = (assignmentid) => {
    fetch(`/assignments/id/${assignmentid}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          console.log(response.results[0].AssignmentName);
        } else {
          console.log("Cannot get Assignment Name");
        }
      });
  };

  // Calling the delete from s3 store function upon clicking on the button for an individual upload.
  // Once this is successful it calls to delete from the database.
  onDelete = (uploadname) => {
    this.deleteS3File(uploadname);
  };

  // Function to delete the upload from the database.
  // Will get the uploads again once successful to update the display.
  // Also shows a success or failure message to the user upon completion.
  deleteUploadDB = (uploadname) => {
    fetch("/uploads/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: uploadname,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          this.setState({
            message: response.message,
            messagestyle: "green",
          });
          this.getUploads();
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

  // Function to delete the uploade file from the aws s3 store.
  // Will call function to delete from the database upon successful deletion.
  deleteS3File = (uploadname) => {
    fetch("/s3/deletefile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: uploadname,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          this.deleteUploadDB(uploadname);
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

  // Rendering the content for the component.
  render() {
    let { uploads } = this.state;
    return (
      <div>
        <div className="row">
          <div className="col s12">
            <h5 className="center">Uploads</h5>
          </div>
        </div>

        <div className="divider" />

        <div className="section">
          <div className="row">
            <div className="col s12">
              {this.state.message !== "" ? (
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
          {uploads.map((upload) => (
            <Upload
              key={upload.UploadName}
              AssignmentID={upload.AssignmentID}
              UploadName={upload.UploadName}
              onDelete={this.onDelete}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default StudentUploads;
