const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // unique: true,
  },
  password: {
    type: String,
    required: false,
    validate: [
      {
        validator: function (password) {
          return password && password.toString().trim().length >= 8;
        },
        message: "password should be 8 digits",
      },
    ],
  },
  mobile: {
    type: String,
    required: true,
  },
  address1:{
    type: String,
    required: false,
  },
  address1:{
    type: String,
    required: false,
  },
  address2:{
    type: String,
    required: false,
  },
  address3:{
    type: String,
    required: false,
  },
  city:{
    type: String,
    required: false,
  },
  landmark:{
    type: String,
    required: false,
  },
  pincode:{
    type: String,
    required: false,
  },
  token: {
    type: String,
    default: "",
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
