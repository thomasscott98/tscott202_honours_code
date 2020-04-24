/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: Navbar.jsx
 *
 * Description: This sets up the navbar for the student components of the app. It uses the floating action button to create
 * a mobile app-type navbar. Each item in the menu will link to an aspect of the app.
 *
 */

// Module imports
import React, { Component } from "react";
import { Link } from "react-router-dom";
import M from "materialize-css/dist/js/materialize.min.js";
import Cookies from "js-cookie";

class Navbar extends Component {
  state = {};

  // Initalising the floating action button and tooltips for the component.
  componentDidMount() {
    var fabtn = document.querySelectorAll(".fixed-action-btn");
    M.FloatingActionButton.init(fabtn, { hoverEnabled: false });

    var tooltips = document.querySelectorAll(".tooltipped");
    M.Tooltip.init(tooltips, {});
  }

  // Logout button is clicked and the cookies are removed and the page refreshed.
  // This will cause the App component to check if the user type is set (which it won't be) thus
  // the user will be asked to sign in again.
  // NOTE: There is probably a more efficient way to do this (i.e. without a full refresh) via the
  // use of Redirects but there was issues trying to implement this effectively.
  logout = () => {
    Cookies.remove("firstname");
    Cookies.remove("lastname");
    Cookies.remove("studentid");
    Cookies.remove("token");
    Cookies.remove("type");
    window.location.reload(false);
  };

  // Rendering the navabar component with links to the different aspects of the app.
  render() {
    return (
      <div>
        <nav className="blue">
          <div className="nav-wrapper container">
            <a href="/" className="brand-logo">
              MyGrade
            </a>
          </div>
        </nav>

        <div className="fixed-action-btn">
          <div className="btn-floating btn-large red">
            <i className="large material-icons">menu</i>
          </div>
          <ul>
            <li
              className="btn-floating black tooltipped"
              data-position="left"
              data-tooltip="Home"
            >
              <Link to="/student">
                <i className="material-icons">home</i>
              </Link>
            </li>

            <li
              className="btn-floating teal tooltipped"
              data-position="left"
              data-tooltip="Assignments"
            >
              <Link to="/student/assignments">
                <i className="material-icons">assignment</i>
              </Link>
            </li>

            <li
              className="btn-floating orange tooltipped"
              data-position="left"
              data-tooltip="Feedback"
            >
              <Link to="/student/feedback">
                <i className="material-icons">insert_comment</i>
              </Link>
            </li>

            <li
              className="btn-floating pink tooltipped"
              data-position="left"
              data-tooltip="Uploads"
            >
              <Link to="/student/uploads">
                <i className="material-icons">cloud_done</i>
              </Link>
            </li>

            <li
              className="btn-floating purple tooltipped"
              data-position="left"
              data-tooltip="Settings"
            >
              <Link to="/student/settings">
                <i className="material-icons">settings</i>
              </Link>
            </li>

            <li
              className="btn-floating blue tooltipped"
              data-position="left"
              data-tooltip="Logout"
              onClick={this.logout}
            >
              <i className="material-icons">exit_to_app</i>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Navbar;
