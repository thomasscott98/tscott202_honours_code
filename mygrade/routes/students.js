/**
 * Name: Honours Dissertation Project (Server)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: students.js
 *
 * Description: This page is used to handle the students data for the application. It contains paths to get students, create students, as well as
 * to login and register students.
 *
 */

// Module imports
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { connection } = require("../config/db");
const jwt = require("jsonwebtoken");
const secret = "tscott202secret";
const {
  withAuthStudent,
  withAuth,
  withAuthLecturer,
} = require("../middleware");

// Get all students from the database and return via JSON.
router.get("/", withAuthLecturer, (req, res) => {
  let query =
    "SELECT StudentID, StudentEmail, FirstName, LastName FROM Students";

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Could not obtain students.",
      });
    } else {
      return res.status(200).json({
        success: true,
        results,
      });
    }
  });
});

// Get individual student from the database and return via JSON.
router.get("/:id", withAuthLecturer, (req, res) => {
  let query = `SELECT StudentID, StudentEmail, FirstName, LastName FROM Students WHERE StudentID = ?`;

  connection.query(query, req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Could not obtain student.",
      });
    } else {
      return res.status(200).json({
        success: true,
        results,
      });
    }
  });
});

// Regular expression to validate the email entered by the user.
// This is validated at client side also.
// Checks for the @ symbol and then for the end which could be .com or .ac.uk.
function ValidateEmail(email) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  } else {
    return false;
  }
}

// Regular expression used to validate the password the user enters.
// passes in the users password entry and checks for 1 uppercase letter, number, symnbol and its length must be
// between 8 and 15 characters.
function ValidatePassword(password) {
  if (
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(
      password
    )
  ) {
    return true;
  } else {
    return false;
  }
}

// Student signup which creates a new student in the database. Success or Failure returned via JSON.
router.post("/signup", (req, res) => {
  let { email, firstname, lastname, password, passwordConfirm } = req.body;

  if (!email || email.length > 49) {
    return res.status(500).json({
      success: false,
      message: "Email cannot be blank and must be less than 50 characters.",
    });
  } else if (ValidateEmail(email) === false) {
    return res.status(500).json({
      success: false,
      message: "Please enter a valid email.",
    });
  } else if (!firstname || firstname.length < 2 || firstname.length > 29) {
    return res.status(500).json({
      success: false,
      message: "First Name must be between 2 and 29 characters.",
    });
  } else if (!lastname || lastname.length < 2 || lastname.length > 29) {
    return res.status(500).json({
      success: false,
      message: "Last Name must be between 2 and 29 characters.",
    });
  } else if (ValidatePassword(password) === false) {
    return res.status(500).json({
      success: false,
      message:
        "Password must be between 8 and 15 characters, include at least 1 lowercase, 1 uppercase, 1 number and 1 special character.",
    });
  } else if (!passwordConfirm) {
    return res.status(500).json({
      success: false,
      message: "Please confirm your password.",
    });
  } else if (password != passwordConfirm) {
    return res.status(500).json({
      success: false,
      message: "Please ensure the passwords match.",
    });
  } else {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: `Error occured: ${err.message}`,
        });
      } else {
        let query = `INSERT INTO Students (StudentEmail, FirstName, LastName, Password) VALUES (?, ?, ?, ?)`;

        connection.query(
          query,
          [email.toLowerCase(), firstname, lastname, hash],
          (err, _results) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message:
                  "This email has already been used for an account. Please use another.",
              });
            } else {
              return res.status(200).json({
                success: true,
                message: "You have successfully signed up. Please sign in.",
              });
            }
          }
        );
      }
    });
  }
});

// Student Login which validates a users credentials and returns a JSON web token and cookies, as well as success or failure via JSON.
router.post("/login", (req, res) => {
  let { email, password } = req.body;

  if (!email) {
    return res.status(500).json({
      success: false,
      message: "Please enter an email.",
    });
  } else if (!password) {
    return res.status(500).json({
      success: false,
      message: "Please enter a password.",
    });
  } else {
    let query = "SELECT * FROM Students WHERE StudentEmail = ?";

    connection.query(query, email.toLowerCase(), (err, results) => {
      if (results.length === 0) {
        return res.status(500).json({
          success: false,
          message:
            "The email or password entered is invalid. Please try again.",
        });
      } else {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "An error has occured, please try again later.",
          });
        } else {
          bcrypt.compare(password, results[0].Password, (err, same) => {
            if (same) {
              const payload = {
                email,
                studentid: results[0].StudentID,
                type: "student",
                firstname: results[0].FirstName,
                lastname: results[0].LastName,
              };
              const token = jwt.sign(payload, secret, {
                expiresIn: "30d",
              });

              res.cookie("token", token, {
                maxAge: 5000000 * 10 * 10,
                httpOnly: false,
              });
              res.cookie("firstname", results[0].FirstName, {
                maxAge: 5000000 * 10 * 10,
                httpOnly: false,
              });
              res.cookie("lastname", results[0].LastName, {
                maxAge: 5000000 * 10 * 10,
                httpOnly: false,
              });
              res.cookie("studentid", results[0].StudentID, {
                maxAge: 5000000 * 10 * 10,
                httpOnly: false,
              });
              res.cookie("type", "student", {
                maxAge: 5000000 * 10 * 10,
                httpOnly: false,
              });

              return res.status(200).json({
                success: true,
                message: "Signed in successfully.",
              });
            } else {
              return res.status(500).json({
                success: false,
                message:
                  "The email or password entered is invalid. Please try again.",
              });
            }
          });
        }
      }
    });
  }
});

// Delete student from the database. Returns success or failure via JSON.
router.post("/delete", withAuthStudent, (req, res) => {
  let { id } = req.body;

  if (!id) {
    return res.status(500).json({
      success: false,
      message: "Cannot get ID.",
    });
  } else {
    let query = "SELECT * FROM Students WHERE StudentID = ?";

    connection.query(query, id, (err, results) => {
      if (results.length === 0)
        return res.status(500).json({
          success: false,
          message:
            "An error has occured while deleting this user. Try again later.",
        });
      if (err) {
        return res.status(500).json({
          success: false,
          message:
            "An error has occured while deleting this user. Try again later.",
        });
      } else {
        let query = `DELETE FROM Students WHERE StudentID = ?`;

        connection.query(query, id, (err, _results) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message:
                "An error has occured while deleting this user. Try again later.",
            });
          } else {
            return res.status(200).json({
              success: true,
              message: "Student account has been deleted.",
            });
          }
        });
      }
    });
  }
});

module.exports = router;
