const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const shortId = require("shortid");
const jsonwebtoken = require("jsonwebtoken");
const { expressjwt: jwt } = require("express-jwt");
const secret = require("../../config/keys").secretOrKey;

const { runValidation } = require("../../validation");
const { validateRegisterInput } = require("../../validation/register");
const { userLoginValidator } = require("../../validation/login");

const adminMiddleware = (req, res, next) => {
  const adminUserId = req.auth._id;
  User.findById({ _id: adminUserId })
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      if (user.role !== 1) {
        return res.status(400).json({
          error: "Admin resource. Access denied",
        });
      }
      req.profile = user;
      next();
    })
    .catch(function (err) {
      return res.status(400).json({
        error: "User not found",
      });
    });
};

const authMiddleware = (req, res, next) => {
  const authUserId = req.auth._id;
  User.findById({ _id: authUserId })
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      req.profile = user;
      next();
    })
    .catch(function (err) {
      return res.status(400).json({
        error: "User not found",
      });
    });
};

const requireSignin = jwt({
  secret: `${secret}`,
  algorithms: ["HS256"],
  userProperty: "auth",
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

router.post("/login", userLoginValidator, runValidation, (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user || !user.authenticate(password)) {
        return res.status(400).json({
          error: "Invalid credentials.",
        });
      }

      const token = jsonwebtoken.sign({ _id: user._id }, `${secret}`, {
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

router.get("/profile", requireSignin, authMiddleware, (req, res) => {
  req.profile.hashed_password = undefined;
  return res.json(req.profile);
});

module.exports = router;
