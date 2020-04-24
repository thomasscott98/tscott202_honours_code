/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: Uploads.jsx
 *
 * Description: This page shows all the uploads from students, using the Upload component
 * to display each individual upload details.
 *
 */

// Module imports
import React, { Component } from "react";
import Upload from "../Components/Upload";

class Uploads extends Component {
  // Setting the state for the component.
  state = { uploads: [], message: null, messagestyle: "" };

  // Getting all the uploads upon component mounting.
  componentDidMount() {
    this.getUploads();
  }

  /**
   * Function with a fetch request to obtain the uploads students have made.
   * On success the results are stored in state, on failure the appropriate error
   * message is shown to the user.
   */
  getUploads = () => {
    fetch("/uploads/")
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          this.setState({ uploads: response.results });
        } else {
          this.setState({
            message: response.message,
            messagestyle: "red",
          });
        }
      })
      .catch((err) => {
        this.setState({
          message: "Cannot connnect to database. Try again later.",
          messagestyle: "red",
        });
      });
  };

  // Renders the component details.
  render() {
    let uploads = this.state.uploads;

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
          {uploads.map((upload) => (
            <Upload
              key={upload.UploadName}
              name={upload.UploadName}
              studentid={upload.StudentID}
              assignmentid={upload.AssignmentID}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Uploads;
