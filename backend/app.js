const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const users = require("./routes/api/users");
const cors = require("cors");

require("dotenv/config");

// const api = process.env.API;

app.use(express.json());
app.use(morgan("dev"));

if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: `${process.env.URL}` }));
  app.options("*", cors());
}

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", users);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
