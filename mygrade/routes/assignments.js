/**
 * Name: Honours Dissertation Project (Server)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: feedback.js
 *
 * Description: This page is used to handle the feedback stored in the database. It contains paths to get, create and delete feedback.
 *
 */

// Module imports
const express = require("express");
const router = express.Router();
const { connection } = require("../config/db");
const {
  withAuthLecturer,
  withAuth,
  withAuthStudent,
} = require("../middleware");

// Get all assignments from the database and sends results via JSON.
router.get("/", withAuth, (_req, res) => {
  let query = "SELECT * FROM Assignments";

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Could not obtain assignments.",
      });
    } else {
      return res.status(200).json({
        success: true,
        results,
      });
    }
  });
});

// Get individual assignment from database and sends results via JSON.
router.get("/id/:id", withAuth, (req, res) => {
  let query = `SELECT * FROM Assignments WHERE AssignmentID = ?`;

  connection.query(query, req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Could not obtain assignments.",
      });
    } else {
      return res.status(200).json({
        success: true,
        results,
      });
    }
  });
});

// Get assignments by lecturer ID and sends results via JSON.
router.get("/lecturerid/:id", withAuthLecturer, (req, res) => {
  let query = `SELECT * FROM Assignments WHERE LecturerID = ?`;

  connection.query(query, req.params.id, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Could not obtain assignments.",
      });
    } else {
      return res.status(200).json({
        success: true,
        results,
      });
    }
  });
});

// Delete assignment and sends results via JSON.
router.post("/delete", withAuthLecturer, (req, res) => {
  let { id } = req.body;

  if (!id) {
    return res.status(500).json({
      success: false,
      message: "Cannot get ID.",
    });
  } else {
    let query = "SELECT * FROM Assignments WHERE AssignmentID = ?";

    connection.query(query, id, (err, results) => {
      if (results.length === 0) {
        return res.status(500).json({
          success: false,
          message:
            "An error has occured while deleting this assignment. Try again later.",
        });
      } else if (err) {
        return res.status(500).json({
          success: false,
          message:
            "An error has occured while deleting this assignment. Try again later.",
        });
      } else {
        let query = `DELETE FROM Assignments WHERE AssignmentID = ?`;

        connection.query(query, id, (err, _results) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Could not delete assignment.",
            });
          } else {
            return res.status(200).json({
              success: true,
              message: "Assignment has been deleted.",
            });
          }
        });
      }
    });
  }
});

// Create assignment and sends the success or failure via JSON.
router.post("/createassignment", withAuthLecturer, (req, res) => {
  let {
    assignmentname,
    assignmentdescription,
    marksavailable,
    lecturerid,
  } = req.body;

  if (!assignmentname || assignmentname.length > 49) {
    return res.status(500).json({
      success: false,
      message:
        "Assignment Name cannot be blank and must be less than 50 characters.",
    });
  } else if (!assignmentdescription || assignmentdescription.length > 255) {
    return res.status(500).json({
      success: false,
      message:
        "Assignment Description cannot be blank or above 255 characters.",
    });
  } else if (
    !marksavailable ||
    parseInt(marksavailable) > 100 ||
    parseInt(marksavailable) < 1
  ) {
    return res.status(500).json({
      success: false,
      message: "Marks Available cannot be blank and must be between 0 and 100.",
    });
  } else if (!lecturerid) {
    return res.status(500).json({
      success: false,
      message: "A lecturer must be selected.",
    });
  } else {
    let query =
      "INSERT INTO Assignments (AssignmentName, AssignmentDescription, MarksAvailable, LecturerID) VALUES (?, ?, ?, ?)";

    connection.query(
      query,
      [assignmentname, assignmentdescription, marksavailable, lecturerid],
      (err, _results) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message:
              "An error occured while creating assignment, please try again later." +
              err,
          });
        } else {
          return res.status(200).json({
            success: true,
            message: "Assignment has been created successfully.",
          });
        }
      }
    );
  }
});

module.exports = router;
