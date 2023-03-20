const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const { runValidation } = require("../../validation");
const { validateRegisterInput } = require("../../validation/register");
const { userLoginValidator } = require("../../validation/login");

router.post("/register", validateRegisterInput, runValidation, (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({
        error: "A User is already registered with that email",
      });
    } else {
      let username = shortId.generate();
      let profile = `${process.env.URL}/profile/${username}`;
      let newUser = new User({ name, email, password, profile, username });
      newUser
        .save()
        .then(function (user) {
          return res.json({
            message: "Signup success! Please sign in.",
          });
        })
        .catch(function (err) {
          return res.status(400).json({
            error: err,
          });
        });
    }
  });
});

router.post("/login", userLoginValidator, runValidation, (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user || !user.authenticate(password)) {
        return res.status(400).json({
          error: "Invalid credentials.",
        });
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 604800,
      });

      res.cookie("token", token, { expiresIn: 604800 });
      const { _id, username, name, email, role } = user;
      return res.json({
        token,
        user: { _id, username, name, email, role },
      });
    })
    .catch(function (err) {
      return res.status(400).json({
        error: "Invalid credentials.",
      });
    });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Logout success",
  });
});

module.exports = router;
