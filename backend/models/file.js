const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  dataFile: {
    type: String,
    required: true,
  },
  dataFileUrl: {
    type: String,
    required: true,
  },
  readmeText: {
    type: String,
    required: true,
  },
  readmeTextUrl: {
    type: String,
    required: true,
  },
  submittedBy: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  organizationName: {
    type: String,
    required: true
  },
  designatedOfficerName: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  emailId: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  folderName: {
    type: String,
    required: true
  }
});
const File = (module.exports = mongoose.model("File", fileSchema));

module.exports.addFile = async function (file) {
  return File.create(file);
};
