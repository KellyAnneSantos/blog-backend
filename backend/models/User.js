const mongoose = require("mongoose");
const schema = mongoose.Schema;
const crypto = require("crypto");

const userSchema = new schema(
  {
    about: {
      type: String,
    },
    email: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    hashed_password: {
      required: true,
      type: String,
    },
    name: {
      max: 30,
      required: true,
      trim: true,
      type: String,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    profile: {
      required: true,
      type: String,
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },
    role: {
      trim: true,
      type: Number,
    },
    salt: String,
    username: {
      index: true,
      lowercase: true,
      max: 30,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
  },
  { timestamp: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
