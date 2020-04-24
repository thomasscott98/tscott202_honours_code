/**
 * Name: Honours Dissertation Project (Client)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: Home.jsx
 *
 * Description: This is the home page for the lecturer side of the app.
 * It provides basic info on what the lecturer can do.
 *
 */

// Module imports
import React, { Component } from "react";
import Cookies from "js-cookie";

class Home extends Component {
  state = {};

  // Renders the component details.
  render() {
    const firstname = Cookies.get("firstname");
    const lastname = Cookies.get("lastname");

    return (
      <div>
        <div className="row">
          <div className="col s12">
            <h5 className="center">
              Welcome, {firstname} {lastname}
            </h5>
          </div>
        </div>
        <div className="divider" />

        <div className="section">
          <div className="row">
            <div className="col s12">
              <div style={{ padding: "0.5em" }} className="orange">
                <i className="left material-icons">error</i>
                IMPORTANT NOTE! This app is a Progressive Web App and is
                installable on the device. If on Chrome for Android, you should
                have a banner at the bottom of this page asking to add the app
                to the home screen. Please do this to get a native
                like-experience. IOS users running the latest version of Safari
                can also use this feature by going to the site options and
                clicking add to homescreen. You can also install via Chrome for
                desktop by clicking the + icon to the left of the bookmark
                button. Thank you!
              </div>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="row">
          <div className="col s12">
            <h6 className="center">Introduction</h6>
            <p>
              This is the lecturer area of the MyGrade app. Here you have
              various functionality available to you. To navigate the site use
              the menu icon available at the bottom right of the screen.
            </p>
            <p>What you can do as a lecturer: </p>
            <ul className="collection">
              <li className="collection-item">View Assignments</li>
              <li className="collection-item">Create Assignments</li>
              <li className="collection-item">Delete Assignment</li>
              <li className="collection-item">View Uploads</li>
              <li className="collection-item">Download Uploads</li>
              <li className="collection-item">Create Feedback</li>
              <li className="collection-item">Delete Feedback</li>
              <li className="collection-item">Delete Account</li>
              <li className="collection-item">Logout</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
