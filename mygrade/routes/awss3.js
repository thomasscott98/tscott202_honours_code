/**
 * Name: Honours Dissertation Project (Server)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: awss3.js
 *
 * Description: This page is used to connect to AWS S3 where the uploads and feedback will be stored. There
 * are paths to upload, download and delete from S3.
 *
 */

// Module imports
const express = require("express");
const AWS = require("aws-sdk");
const router = express.Router();

// Config details for AWS.
AWS.config.update({
  accessKeyId: "",
  secretAccessKey: "",
});

// Creating new S3 instance with configuration.
// v4 needed to ensure the URL works.
const s3 = new AWS.S3({
  signatureVersion: "v4",
  region: "eu-west-2",
});

// Uploading file which client sent to the S3 service. Returns success or failure via JSON.
router.post("/uploadfile", (req, res) => {
  if (req.files === null) {
    return res.status(500).json({
      success: false,
      message: "No file uploaded",
    });
  } else {
    let file = req.files.file;

    let params = {
      Bucket: "tscott202-feedbacksystem",
      Body: file.data,
      Key: file.name,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "No file uploaded",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "File successfully uploaded",
        });
      }
    });
  }
});

// Gets the file name from the client and generates a download URL for the client. Sends via JSON.
router.get("/downloadfile/:name", (req, res) => {
  let name = req.params.name;

  let params = {
    Bucket: "tscott202-feedbacksystem",
    Key: name,
  };

  s3.getSignedUrl("getObject", params, (err, url) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error getting download",
      });
    } else {
      return res.status(200).json({
        success: true,
        downloadURL: url,
      });
    }
  });
});

// Deletes a file from S3. Sends success or failure via JSON.
router.post("/deletefile", (req, res) => {
  let { name } = req.body;

  let params = {
    Bucket: "tscott202-feedbacksystem",
    Key: name,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "File has not been deleted.",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "File successfully deleted.",
      });
    }
  });
});

module.exports = router;
