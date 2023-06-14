const mongoose = require("mongoose");

const organisationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
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
  permanentAddress: {
    type: String,
    required: true,
  },
  communicationAddress: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    default: "",
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

const organisationDetail = mongoose.model(
  "organisationDetail",
  organisationSchema
);

module.exports = organisationDetail;
