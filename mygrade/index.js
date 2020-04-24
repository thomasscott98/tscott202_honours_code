/**
 * Name: Honours Dissertation Project (Server)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: index.js
 *
 * Description: This page sets up the express server, its dependencies and sets up the
 * connections to the routes. It also holds basic authentication paths to quickly validate the user.
 *
 */

// Module imports
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const { withAuth, withAuthLecturer, withAuthStudent } = require("./middleware");

// Setting up express, port number, cors, file upload, cookie-parser and body-parser.
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "client/build")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(fileupload());
app.use(cors());

// Declaring the routes along with their required files.
app.use("/students", require("./routes/students"));
app.use("/lecturers", require("./routes/lecturers"));
app.use("/assignments", require("./routes/assignments"));
app.use("/uploads", require("./routes/uploads"));
app.use("/feedback", require("./routes/feedback"));
app.use("/s3", require("./routes/awss3"));

/**
 * Quick routes used to validate the user type.
 */
app.get("/checktoken", withAuth, (req, res) => {
  res.sendStatus(200);
});

app.get("/checktokenstudent", withAuthStudent, (req, res) => {
  res.sendStatus(200);
});

app.get("/checktokenlecturer", withAuthLecturer, (req, res) => {
  res.sendStatus(200);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

// Listening for the connection
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
