/**
 * Name: Honours Dissertation Project (Server)
 *
 * Author: Thomas Scott (tscott202)
 *
 * Date Completed: 04/04/2020
 *
 * File Name: middleware.js
 *
 * Description: This page is used to handle the JSON tokens, to ensure they are valid and not expired. There are three to validate for any user, or individually for the student and lecturer.
 *
 */

// middleware.js
const jwt = require("jsonwebtoken");
const secret = "tscott202secret";

const withAuthStudent = function (req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.json({
      success: false,
      message: "Unauthorised. No token provided.",
    });
  } else {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Unauthorised. Inavlid token.",
        });
      } else if (decoded.type !== "student") {
        return res.json({
          success: false,
          message: "You cannot perform this action.",
        });
      } else {
        next();
      }
    });
  }
};

const withAuthLecturer = function (req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.json({
      success: false,
      message: "Unauthorised. No token provided.",
    });
  } else {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Unauthorised. Inavlid token.",
        });
      } else if (decoded.type !== "lecturer") {
        return res.json({
          success: false,
          message: "You cannot perform this action.",
        });
      } else {
        next();
      }
    });
  }
};

const withAuth = function (req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.json({
        success: false,
        message: "Unauthorised. No token provided.",
      });
    } else {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: "Unauthorised. Inavlid token.",
          });
        } else {
          next();
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { withAuthStudent, withAuthLecturer, withAuth };
