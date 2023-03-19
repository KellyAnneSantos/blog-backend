const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const shortId = require("shortid");

const { runValidation } = require("../../validation");
const { validateRegisterInput } = require("../../validation/register");

router.get("/test", (req, res) => {
  res.json({ msg: "This is the user route" });
});

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

module.exports = router;
