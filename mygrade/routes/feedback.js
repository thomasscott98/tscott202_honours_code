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
const { withAuthLecturer, withAuth } = require("../middleware");

// Get all feedack from the database and return in JSON format.
router.get("/", withAuthLecturer, (_req, res) => {
  let query = "SELECT * FROM FeedbackDocs";

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Could not obtain feedback.",
      });
    } else {
      return res.status(200).json({
        success: true,
        results,
      });
    }
  });
});

// Get individual feedback from the database and return in JSON format.
router.get("/feedbackname/:id", withAuth, (req, res) => {
  let query = `SELECT * FROM FeedbackDocs WHERE FeedbackName = ?`;

  connection.query(query, req.params.id, (err, results) => {
    if (err || results.length < 1) {
      return res.status(500).json({
        success: false,
        message: "Could not obtain feedback.",
      });
    } else {
      return res.status(200).json({
        success: true,
        results,
      });
    }
  });
});

// Get feedback by student id and return in JSON.
router.get("/studentid/:id", withAuth, (req, res) => {
  let query = `SELECT * FROM FeedbackDocs WHERE StudentID = ?`;

  connection.query(query, req.params.id, (err, results) => {
    if (err || results.length < 1) {
      return res.status(500).json({
        success: false,
        message: "Could not obtain feedback.",
      });
    } else {
      return res.status(200).json({
        success: true,
        results,
      });
    }
  });
});

// Get feedback by assignment id and return in JSON.
router.get("/assignmentid/:id", withAuth, (req, res) => {
  let query = `SELECT * FROM FeedbackDocs WHERE AssignmentID = ?`;

  connection.query(query, req.params.id, (err, results) => {
    if (err || results.length < 1) {
      return res.status(500).json({
        success: false,
        message: "Could not obtain feedback.",
      });
    } else {
      return res.status(200).json({
        success: true,
        results,
      });
    }
  });
});

// Get feedback by lecturer and return in JSON.
router.get("/lecturerid/:id", withAuthLecturer, (req, res) => {
  let query = `SELECT * FROM FeedbackDocs WHERE LecturerID = ?`;

  connection.query(query, req.params.id, (err, results) => {
    if (err || results.length < 1) {
      return res.status(500).json({
        success: false,
        message: "Could not obtain feedback.",
      });
    } else {
      return res.status(200).json({
        success: true,
        results,
      });
    }
  });
});

// Check if the feedback exists and return via JSON.
router.get(
  "/exists/:assignmentid/:studentid/:lecturerid",
  withAuthLecturer,
  (req, res) => {
    let query = `SELECT * FROM FeedbackDocs WHERE AssignmentID = ? AND StudentID = ? AND LecturerID = ?`;

    connection.query(
      query,
      [req.params.assignmentid, req.params.studentid, req.params.lecturerid],
      (err, results) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Could not obtain feedback.",
          });
        } else if (results.length > 0) {
          return res.status(200).json({
            success: true,
            message: "Feedback exists",
            results,
          });
        } else {
          return res.status(500).json({
            success: false,
            message: "No Feedback Available.",
          });
        }
      }
    );
  }
);

// Create feedback and return success or failure via JSON.
router.post("/createfeedback", withAuthLecturer, (req, res) => {
  let {
    feedbackname,
    grade,
    mark,
    studentid,
    assignmentid,
    lecturerid,
  } = req.body;

  if (!feedbackname || feedbackname.length > 99) {
    return res.status(500).json({
      success: false,
      message:
        "Feedback Name cannot be blank and must be less than 100 characters.",
    });
  } else if (!grade || grade.length > 20) {
    return res.status(500).json({
      success: false,
      message: "Grade cannot be blank or above 20 characters.",
    });
  } else if (!mark || parseInt(mark) > 100 || parseInt(mark) < 1) {
    return res.status(500).json({
      success: false,
      message: "Mark cannot be blank and must be between 0 and 100.",
    });
  } else if (!studentid) {
    return res.status(500).json({
      success: false,
      message: "Student must be selected.",
    });
  } else if (!assignmentid) {
    return res.status(500).json({
      success: false,
      message: "Assignment must be selected.",
    });
  } else if (!lecturerid) {
    return res.status(500).json({
      success: false,
      message: "Lecturer must be selected.",
    });
  } else {
    let query =
      "INSERT INTO FeedbackDocs (FeedbackName, Grade, Mark, StudentID, AssignmentID, LecturerID) VALUES (?, ?, ?, ?, ?, ?)";

    connection.query(
      query,
      [feedbackname, grade, mark, studentid, assignmentid, lecturerid],
      (err, _results) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message:
              "An error occured while creating feedback, please try again later.",
          });
        } else {
          return res.status(200).json({
            success: true,
            message: "Feedback has been created successfully.",
          });
        }
      }
    );
  }
});

// Delete feedback from the database and return success or failure via JSON.
router.post("/delete", withAuthLecturer, (req, res) => {
  let { name } = req.body;

  if (!name) {
    return res.status(500).json({
      success: false,
      message: "Cannot get name.",
    });
  } else {
    let query = "SELECT * FROM FeedbackDocs WHERE FeedbackName = ?";

    connection.query(query, name, (err, results) => {
      if (results.length === 0) {
        return res.status(500).json({
          success: false,
          message:
            "An error has occured while deleting this feedback. Try again later.",
        });
      } else if (err) {
        return res.status(500).json({
          success: false,
          message:
            "An error has occured while deleting this feedback. Try again later.",
        });
      } else {
        let query = "DELETE FROM FeedbackDocs WHERE FeedbackName = ?";

        connection.query(query, name, (err, results) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Could not delete feedback.",
            });
          } else {
            return res.status(200).json({
              success: true,
              message: "Feedback has been deleted.",
            });
          }
        });
      }
    });
  }
});

// Delete all feedback by AssignmentID and return success or failure via JSON.
router.post("/deleteall", withAuthLecturer, (req, res) => {
  let { assignmentid } = req.body;

  if (!assignmentid) {
    return res.status(500).json({
      success: false,
      message: "Cannot get feedback.",
    });
  } else {
    let query = "SELECT * FROM FeedbackDocs WHERE AssignmentID = ?";

    connection.query(query, assignmentid, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message:
            "An error has occured while deleting feedback. Try again later.",
        });
      } else {
        let query = "DELETE FROM FeedbackDocs WHERE AssignmentID = ?";

        connection.query(query, assignmentid, (err, results) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Could not delete feedback.",
            });
          } else {
            return res.status(200).json({
              success: true,
              message: "Feedback have been deleted.",
            });
          }
        });
      }
    });
  }
});

module.exports = router;
