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
  phone: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    default: "",
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
