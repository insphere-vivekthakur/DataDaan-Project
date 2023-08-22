const mongoose = require("mongoose");

const userAuthSchema = mongoose.Schema({
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
});

const UserAuth = mongoose.model("UserAuth", userAuthSchema);

module.exports = UserAuth;
