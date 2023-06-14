const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const file = require("./routes/file");
const bodyParser = require("body-parser");

const uri = process.env.URI;
mongoose.connect(uri, { useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", function (err) {
  console.log(err);
});

db.once("open", function () {
  console.log("handshake established");
});


const app = express();
const port = process.env.PORT;

// user route
const userRoute = require("./routes/userRoute");

app.use("/", userRoute);
app.use("/", file);
app.get("", (req, res) => {
  return res.json("Rohit Kumar Shukla");
});
app.listen(port, function () {
  console.log(`server is running on ${port}`);
});
