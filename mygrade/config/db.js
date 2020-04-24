/**
 * Name: Honours Dissertation Project (Server)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: db.js
 *
 * Description: This page is used to set up the database connection.
 *
 */

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "",
  user: "admin",
  password: "",
  database: "honoursFeedbackSystem",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("CONNECTED TO DB");
  }
});

module.exports = { connection };
