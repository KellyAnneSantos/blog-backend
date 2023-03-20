const { check } = require("express-validator");
exports.validateRegisterInput = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Email is invalid"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
