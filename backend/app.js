const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;

// require("dotenv/config");

// const api = process.env.API;

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 3000;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
