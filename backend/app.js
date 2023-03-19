const express = require("express");
const app = express();
const morgan = require("morgan");

require("dotenv/config");

const api = process.env.API;

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
