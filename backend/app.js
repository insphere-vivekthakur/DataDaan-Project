const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const file = require("./routes/file");
const bodyParser = require("body-parser");

const uri = process.env.URI;
const connectionpOptions = {
  dbName: `bhashiniDatadaan`,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(uri, connectionpOptions);
const db = mongoose.connection;

db.on("error", function (err) {
  console.log(err);
});

db.once("open", function () {
  console.log("handshake established");
});

const app = express();
const port = process.env.PORT;
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
// user route
const userRoute = require("./routes/userRoute");

app.use("/", userRoute);
app.use("/", file);
app.get("", (req, res) => {
  return res.status(200).send("<h1>Welcome to Datadaan Portal</h1>");
});
app.listen(port, function () {
  console.log(`server is running on ${port}`);
});
