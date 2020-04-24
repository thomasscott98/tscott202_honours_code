/**
 * Name: Honours Dissertation Project (Server)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: uploads.js
 *
 * Description: This page is used to handle the uploads for the application. It contains paths to get uploads, create uploads and delete uploads.
 *
 */

// Module imports
const express = require("express");
const router = express.Router();
const { connection } = require("../config/db");
const {
  withAuthStudent,
  withAuthLecturer,
  withAuth,
} = require("../middleware");

// Get all uploads from the database and return via JSON.
router.get("/", withAuthLecturer, (_req, res) => {
  let query = "SELECT * FROM AssignmentUploads";

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Could not obtain uploads.",
      });
    } else {
      return res.status(200).json({
        success: true,
        results,
      });
    }
  });
});

// Get individual upload from the database and return via JSON.
router.get("/name/:name", (req, res) => {
  let query = `SELECT * FROM AssignmentUploads WHERE UploadName = ?`;

  connection.query(query, req.params.name, (err, results) => {
    if (err || results.length < 1) {
      return res.status(500).json({
        success: false,
        message: "Could not obtain uploads.",
      });
    } else {
      return res.status(200).json({
        success: true,
        results,
      });
    }
  });
});

// Get uploads by student ID and return via JSON.
router.get("/studentid/:id", (req, res) => {
  let query = `SELECT * FROM AssignmentUploads WHERE StudentID = ?`;

  connection.query(query, req.params.id, (err, results) => {
    if (err || results.length < 1) {
      return res.status(500).json({
        success: false,
        message: "Could not obtain uploads.",
      });
    } else {
      return res.status(200).json({
        success: true,
        results,
      });
    }
  });
});

// Get uploads by Assignment ID and return via JSON.
router.get("/assignmentid/:id", (req, res) => {
  let query = `SELECT * FROM AssignmentUploads WHERE AssignmentID = ?`;

  connection.query(query, req.params.id, (err, results) => {
    if (err || results.length < 1) {
      return res.status(500).json({
        success: false,
        message: "Could not obtain uploads.",
      });
    } else {
      return res.status(200).json({
        success: true,
        results,
      });
    }
  });
});

// Check if the upload exists and returning via JSON.
router.get("/checkexists/:assignmentid/:studentid", (req, res) => {
  let query = `SELECT * FROM AssignmentUploads WHERE AssignmentID = ? AND StudentID = ?`;

  connection.query(
    query,
    [req.params.assignmentid, req.params.studentid],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Could not obtain uploads." + err.message,
        });
      } else if (results.length > 0) {
        return res.status(200).json({
          success: true,
          results,
        });
      } else {
        return res.status(500).json({
          success: false,
          results,
        });
      }
    }
  );
});

// Create upload and add to the database. Returns success or failure via JSON.
router.post("/createupload", withAuthStudent, (req, res) => {
  let {
    uploadname,
    studentid,
    assignmentid,
    feedbackmethod,
    hidemarks,
  } = req.body;

  if (!uploadname || uploadname.length > 99) {
    return res.status(500).json({
      success: false,
      message:
        "Upload Name cannot be blank and must be less than 100 characters.",
    });
  } else if (!studentid) {
    return res.status(500).json({
      success: false,
      message: "Student ID cannot be blank.",
    });
  } else if (!assignmentid) {
    return res.status(500).json({
      success: false,
      message: "Assignment ID cannot be blank.",
    });
  } else if (!feedbackmethod) {
    return res.status(500).json({
      success: false,
      message: "Feedback Method cannot be blank.",
    });
  } else if (!hidemarks) {
    return res.status(500).json({
      success: false,
      message: "Hide Marks cannot be blank.",
    });
  } else {
    let query =
      "INSERT INTO AssignmentUploads (UploadName, StudentID, AssignmentID, FeedbackMethod, HideMarks) VALUES (?, ?, ?, ?, ?)";

    connection.query(
      query,
      [uploadname, studentid, assignmentid, feedbackmethod, hidemarks],
      (err, results) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message:
              "An error occured while creating upload, please try again later.",
          });
        } else {
          return res.status(200).json({
            success: true,
            message: "Upload has been created successfully.",
          });
        }
      }
    );
  }
});

// Deletes upload from the database and returns success or failure via JSON.
router.post("/delete", withAuthStudent, (req, res) => {
  let { name } = req.body;

  if (!name) {
    return res.status(500).json({
      success: false,
      message: "Cannot get name.",
    });
  } else {
    let query = "SELECT * FROM AssignmentUploads WHERE UploadName = ?";

    connection.query(query, name, (err, results) => {
      if (results.length === 0) {
        return res.status(500).json({
          success: false,
          message:
            "An error has occured while deleting this upload. Try again later.",
        });
      } else if (err) {
        return res.status(500).json({
          success: false,
          message:
            "An error has occured while deleting this upload. Try again later.",
        });
      } else {
        let query = "DELETE FROM AssignmentUploads WHERE UploadName = ?";

        connection.query(query, name, (err, results) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Could not delete upload.",
            });
          } else {
            return res.status(200).json({
              success: true,
              message: "Upload has been deleted.",
            });
          }
        });
      }
    });
  }
});

// Delete all uploads by AssignmentID then returns success or failure via JSON.
router.post("/deleteall", withAuthLecturer, (req, res) => {
  let { assignmentid } = req.body;

  if (!assignmentid) {
    return res.status(500).json({
      success: false,
      message: "Cannot get uploads.",
    });
  } else {
    let query = "SELECT * FROM AssignmentUploads WHERE AssignmentID = ?";

    connection.query(query, assignmentid, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message:
            "An error has occured while deleting uploads. Try again later.",
        });
      } else {
        let query = "DELETE FROM AssignmentUploads WHERE AssignmentID = ?";

        connection.query(query, assignmentid, (err, results) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Could not delete uploads.",
            });
          } else {
            return res.status(200).json({
              success: true,
              message: "Uploads have been deleted.",
            });
          }
        });
      }
    });
  }
});

module.exports = router;
