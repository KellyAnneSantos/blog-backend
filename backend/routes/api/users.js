const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const shortId = require("shortid");

const { runValidation } = require("../../validation");
const { validateRegisterInput } = require("../../validation/register");

router.get("/test", (req, res) => {
  res.json({ msg: "This is the user route" });
});

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "A user is already registered with that email",
      });
    }

    let username = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;

    let newUser = new User({ name, email, password, profile, username });
    newUser.save((err, success) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({
        message: "Signup success! Please sign in.",
      });
    });
  });
});

module.exports = router;
