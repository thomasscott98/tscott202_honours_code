/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: Settings.jsx
 *
 * Description: This is the settings page for the user whereby they can delete the account.
 *
 */

// Module imports
import React, { Component } from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import Cookies from "js-cookie";

class Settings extends Component {
  // Setting state for the component.
  state = { message: "", messagestyle: "" };

  componentDidMount() {
    // initalising the modal so that it works.
    let modal = document.querySelectorAll(".modal");
    M.Modal.init(modal, {});
  }

  // Function to delete the user and log them out.
  deleteAccount = (e) => {
    fetch(
      `/students/delete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          id: Cookies.get("studentid"),
        }),
      }
    )
      .then((res) => res.json())
      .then((response) => {
        if (response.success === true) {
          Cookies.remove("firstname");
          Cookies.remove("lastname");
          Cookies.remove("studentid");
          Cookies.remove("token");
          Cookies.remove("type");
          window.location.reload(false);
        } else {
          this.setState({
            message: response.message,
            messagestyle: "Red",
          });
        }
      })
      .catch((err) => {
        this.setState({
          message: "Cannot connect to database. Try again later.",
          messagestyle: "Red",
        });
      });
  };

  // Rendering the component content.
  render() {
    return (
      <div>
        <div className="row">
          <div className="col s12">
            <h5 className="center">Settings</h5>
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
          <button
            data-target="confirmdelete"
            className="btn modal-trigger red waves-effect waves-light col s12"
          >
            Delete Account
            <i className="material-icons right">delete_forever</i>
          </button>
        </div>

        <div id="confirmdelete" className="modal">
          <div className="modal-content">
            <h4>Delete Account?</h4>
            <p>Are you sure you would like to delete this account?</p>
          </div>
          <div className="modal-footer">
            <button className="modal-close left btn blue waves-effect white-text waves-blue btn-flat">
              Cancel
            </button>

            <button
              className="btn red waves-effect white-text waves-red btn-flat"
              onClick={this.deleteAccount}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
