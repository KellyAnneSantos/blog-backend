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
    // resetPasswordLink: {
    //   data: String,
    //   default: "",
    // },
    role: {
      default: 0,
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

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

const User = mongoose.model("User", userSchema);
module.exports = User;
